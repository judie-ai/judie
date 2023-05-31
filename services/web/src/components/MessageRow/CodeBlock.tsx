
import { HiOutlineClipboardList, HiOutlineClipboardCheck } from 'react-icons/hi';
import { BsDownload } from 'react-icons/bs';
import { FC, memo, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import {
  generateRandomString,
  programmingLanguages,
} from '@judie/utils/markdown';
import { Button, Flex, Text } from '@chakra-ui/react';

interface Props {
  language: string;
  value: string;
}

export const CodeBlock: FC<Props> = memo(({ language, value }) => {
  const [isCopied, setIsCopied] = useState<Boolean>(false);

  const copyToClipboard = () => {
    if (!navigator.clipboard || !navigator.clipboard.writeText) {
      return;
    }

    navigator.clipboard.writeText(value).then(() => {
      setIsCopied(true);

      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    });
  };
  const downloadAsFile = () => {
    const fileExtension = programmingLanguages[language] || '.file';
    const suggestedFileName = `file-${generateRandomString(
      3,
      true,
    )}${fileExtension}`;
    const fileName = window.prompt(
      'Enter file name' || '',
      suggestedFileName,
    );

    if (!fileName) {
      // user pressed cancel on prompt
      return;
    }

    const blob = new Blob([value], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = fileName;
    link.href = url;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  return (
    <Flex style={{
      position: "relative",
      fontSize: "1rem",
    }} >
      <Flex  style={{
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0.5rem 1rem"
      }}>
        <Text style={{
          fontSize: "0.75rem",
          fontWeight: "bold",
        }}>{language}</Text>

        <Flex alignItems={"center"}>
          <Button variant="ghost"
            onClick={copyToClipboard}
          >
            {isCopied ? <HiOutlineClipboardCheck size={18} /> : <HiOutlineClipboardList size={18} />}
            {isCopied ? 'Copied!' : 'Copy code'}
          </Button>
          <Button
            variant="ghost"
            onClick={downloadAsFile}
          >
            <BsDownload size={18} />
          </Button>
        </Flex>
      </Flex>

      <SyntaxHighlighter
        language={language}
        style={oneDark}
        customStyle={{ margin: 0 }}
      >
        {value}
      </SyntaxHighlighter>
    </Flex>
  );
});
CodeBlock.displayName = 'CodeBlock';
