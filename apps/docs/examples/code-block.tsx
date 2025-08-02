'use client';

import {
    CodeBlock,
    CodeBlockBody,
    CodeBlockContent,
    CodeBlockCopyButton,
    CodeBlockFiles,
    CodeBlockFilename,
    CodeBlockHeader,
    CodeBlockItem,
    CodeBlockSelect,
    CodeBlockSelectContent,
    CodeBlockSelectItem,
    CodeBlockSelectTrigger,
    CodeBlockSelectValue,
} from '@repo/code-block';

const codeData = [
    {
        language: 'typescript',
        filename: 'example.ts',
        code: `import { useState } from 'react';

export function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}`,
    },
    {
        language: 'javascript',
        filename: 'example.js',
        code: `import { useState } from 'react';

export function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}`,
    },
];

export default function CodeBlockExample() {
    return (
        <div className="w-full max-w-4xl">
            <CodeBlock data={codeData} defaultValue="typescript">
                <CodeBlockHeader>
                    <CodeBlockFiles>
                        {(item) => (
                            <CodeBlockFilename key={item.language} value={item.language}>
                                {item.filename}
                            </CodeBlockFilename>
                        )}
                    </CodeBlockFiles>
                    <CodeBlockSelect>
                        <CodeBlockSelectTrigger>
                            <CodeBlockSelectValue placeholder="Select language..." />
                        </CodeBlockSelectTrigger>
                        <CodeBlockSelectContent>
                            {(item) => (
                                <CodeBlockSelectItem key={item.language} value={item.language}>
                                    {item.filename}
                                </CodeBlockSelectItem>
                            )}
                        </CodeBlockSelectContent>
                    </CodeBlockSelect>
                    <CodeBlockCopyButton />
                </CodeBlockHeader>
                <CodeBlockBody>
                    {(item) => (
                        <CodeBlockItem key={item.language} value={item.language}>
                            <CodeBlockContent language={item.language as any}>
                                {item.code}
                            </CodeBlockContent>
                        </CodeBlockItem>
                    )}
                </CodeBlockBody>
            </CodeBlock>
        </div>
    );
}
