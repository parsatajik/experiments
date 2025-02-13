import {
  pipeline,
  TextGenerationPipeline,
  PipelineType,
  ProgressCallback,
} from "@huggingface/transformers";

class ChatCompletionPipeline {
  static task: PipelineType = "text-generation";
  static model = "HuggingFaceTB/SmolLM2-1.7B-Instruct";
  static instance: TextGenerationPipeline | null = null;

  static async getInstance(progress_callback?: ProgressCallback) {
    if (!this.instance) {
      this.instance = await pipeline("text-generation", this.model, {
        progress_callback,
        device: "webgpu",
      });
    }
    return this.instance;
  }
}

// Listen for messages from the main thread
self.addEventListener("message", async (event) => {
  try {
    // Get pipeline instance
    const generator = await ChatCompletionPipeline.getInstance((x) => {
      // Report back model loading progress
      self.postMessage(x);
    });

    // Format the prompt with instruction format
    const prompt = `Below is an instruction that describes a task. Write a response that appropriately completes the request.

### Instruction:
${event.data.message}

### Response:`;
    
    console.log('Generating with prompt:', prompt);
    try {
      const output = await generator(prompt, {
        max_new_tokens: 50,  // Reduced from 100
        temperature: 0.7,
        top_p: 0.9,
        do_sample: true,
        return_full_text: false,
        repetition_penalty: 1.2,
        max_length: 512  // Add explicit max length
      });
      
      console.log('Raw output:', output);

      if (!output?.[0]?.generated_text) {
        throw new Error('Invalid response format from model');
      }

      self.postMessage({
        status: "complete",
        output: output[0].generated_text.trim(),
      });
    } catch (error) {
      // Handle specific model errors
      if (typeof error === 'number') {
        self.postMessage({
          status: "error",
          error: error === 11567960 
            ? 'Input too long. Please try a shorter message.'
            : `Model error code: ${error}`
        });
        return;  // Return early after sending error
      }
      // Re-throw other errors to be caught by outer try-catch
      throw error;
    }
  } catch (error) {
    console.error('Detailed worker error:', error);
    self.postMessage({
      status: "error",
      error: error instanceof Error ? error.message : String(error)
    });
  }
});

export {};
