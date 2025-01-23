/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */

interface ToolCall {
    toolCallId: string;
    toolName: string;
    args: {
      context: string;
      current_topic: string;
    };
  }
  
  interface SuggestedQuestionsResult {
    toolCallId: string;
    result: {
      suggestions: string[];
    };
  }
  
  // Type guard to check if a chunk is a ToolCall
  function isToolCall(chunk: any): chunk is ToolCall {
    return chunk.toolName === 'suggested_questions';
  }
  
  // Type guard to check if a chunk is a Result
  function isSuggestedQuestionsResult(chunk: any): chunk is SuggestedQuestionsResult {
    return chunk.result?.suggestions !== undefined;
  }
  
  // Process the stream data
export function extractSuggestedQuestions(streamData: any[]) {
    return streamData.filter(chunk => {
      // Check for tool call
      if (chunk.toolName === 'suggested_questions') return true;
      
      // Check for matching result
      if (chunk.result?.suggestions) {
        const matchingCall = streamData.find(
          c => c.toolCallId === chunk.toolCallId && c.toolName === 'suggested_questions'
        );
        return !!matchingCall;
      }
      
      return false;
    });
  }