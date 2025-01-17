import React from "react";
import Link from "next/link";

interface FormattedTextProps {
  content: string;
}

const FormattedText: React.FC<FormattedTextProps> = ({ content }) => {
  // Remove all occurrences of *
  const cleanedContent = content.replace(/\*/g, "");

  // Split the content into lines, handling all types of newlines (\n, \n\n, multiple \n)
  const lines = cleanedContent.split(/\n+/);

  // Track whether we've encountered "Suggested questions:"
  let isSuggestedQuestions = false;

  // Process each line
  const formattedText = lines.map((line, index) => {
    // Check if the line starts with "Suggested questions:"
    if (line.includes("Suggested questions:")) {
      isSuggestedQuestions = true;
    }

    // Check if the line starts with a number (bullet point)
    if (/^\d+\./.test(line)) {
      return (
        <div key={index} className="flex items-start">
          <span className="mr-2">•</span>
          <span className={isSuggestedQuestions ? "italic" : ""}>
            {line
              .replace(/^\d+\.\s*/, "")
              .split(" ")
              .map((word, wordIndex) => {
                // Bold words that end with ":" and don't start with a space
                if (word.endsWith(":") && !word.startsWith(" ", -2)) {
                  return (
                    <strong key={wordIndex} className="font-bold">
                      {word}{" "}
                    </strong>
                  );
                }
                // Handle hyperlinks
                if (word.startsWith("https://")) {
                  return (
                    <span key={wordIndex} className="inline-flex items-center">
                      <Link target="_blank" href={word} passHref>
                       {word}
                      </Link>
                    </span>
                  );
                }
                return word + " ";
              })}
          </span>
        </div>
      );
    }

    // Check if the line is empty (to handle multiple newlines)
    if (line.trim() === "") {
      return <br key={index} />; // Render a line break for empty lines
    }

    // Regular line
    return (
      <p key={index} className={`mb-4 ${isSuggestedQuestions ? "italic" : ""}`}>
        {line.split(" ").map((word, wordIndex) => {
          // Bold words that end with ":" and don't start with a space
          if (word.endsWith(":") && !word.startsWith(" ")) {
            return (
              <strong key={wordIndex} className="font-bold">
                {word}{" "}
              </strong>
            );
          }
          // Handle hyperlinks
          if (word.startsWith("https://")) {
            return (
              <span key={wordIndex} className="inline-flex items-center">
                <Link target="_blank" href={word} passHref>
                 {word}
                </Link>
              </span>
            );
          }
          return word + " ";
        })}
      </p>
    );
  });

  return <div className="w-full">{formattedText}</div>;
};

export default FormattedText;