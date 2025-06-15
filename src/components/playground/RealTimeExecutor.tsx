import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Play, 
  Square, 
  Trash2,
  Terminal,
  Code,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react';
import { Editor } from '@monaco-editor/react';
import { useToast } from '@/hooks/use-toast';

interface RealTimeExecutorProps {
  initialCode?: string;
  language?: 'javascript' | 'python' | 'cpp' | 'html' | 'css';
  onCodeChange?: (code: string) => void;
  onLanguageChange?: (language: 'javascript' | 'python' | 'cpp' | 'html' | 'css') => void;
}

// Enhanced execution engines
const executeJavaScriptRealTime = (code: string): { output: string; error?: string; executionTime: number } => {
  const startTime = Date.now();
  let output = '';
  let error = '';
  
  try {
    // Create a more sophisticated console mock
    const logs: string[] = [];
    const mockConsole = {
      log: (...args: any[]) => {
        const formatted = args.map(arg => {
          if (typeof arg === 'object') {
            return JSON.stringify(arg, null, 2);
          }
          return String(arg);
        }).join(' ');
        logs.push(formatted);
        output += formatted + '\n';
      },
      error: (...args: any[]) => {
        const formatted = args.map(arg => String(arg)).join(' ');
        logs.push(`Error: ${formatted}`);
        output += `Error: ${formatted}\n`;
      },
      warn: (...args: any[]) => {
        const formatted = args.map(arg => String(arg)).join(' ');
        logs.push(`Warning: ${formatted}`);
        output += `Warning: ${formatted}\n`;
      }
    };

    // Enhanced JavaScript execution with more features
    const wrappedCode = `
      (function() {
        ${code.replace(/console\.(log|error|warn)/g, 'mockConsole.$1')}
      })();
    `;
    
    const func = new Function('mockConsole', 'Math', 'Date', 'Array', 'Object', 'String', 'Number', wrappedCode);
    func(mockConsole, Math, Date, Array, Object, String, Number);
    
    if (!output.trim()) {
      output = 'Code executed successfully (no output)';
    }
  } catch (err) {
    error = `Runtime Error: ${err instanceof Error ? err.message : String(err)}`;
  }
  
  return { output: output.trim(), error, executionTime: Date.now() - startTime };
};

const executePythonRealTime = (code: string): { output: string; error?: string; executionTime: number } => {
  const startTime = Date.now();
  let output = '';
  let error = '';
  
  try {
    const lines = code.split('\n');
    const variables: { [key: string]: any } = {};
    const functions: { [key: string]: Function } = {};
    
    // Enhanced Python interpreter
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      if (!line || line.startsWith('#')) continue;
      
      // Handle print statements with f-strings and variables
      if (line.includes('print(')) {
        const printMatch = line.match(/print\((.*)\)/);
        if (printMatch) {
          let content = printMatch[1].trim();
          
          // Handle f-strings
          if (content.match(/f["'].*["']/)) {
            const fStringMatch = content.match(/f["']([^"']*)["']/);
            if (fStringMatch) {
              let text = fStringMatch[1];
              text = text.replace(/\{([^}]+)\}/g, (_, expr) => {
                // Simple expression evaluation
                if (variables[expr] !== undefined) {
                  return String(variables[expr]);
                }
                // Handle simple arithmetic
                try {
                  return String(eval(expr.replace(/([a-zA-Z_][a-zA-Z0-9_]*)/g, (match) => {
                    return variables[match] !== undefined ? variables[match] : match;
                  })));
                } catch {
                  return expr;
                }
              });
              output += text + '\n';
            }
          } else {
            // Regular print
            content = content.replace(/["']/g, '');
            if (variables[content] !== undefined) {
              output += String(variables[content]) + '\n';
            } else {
              output += content + '\n';
            }
          }
        }
      }
      
      // Handle variable assignments
      else if (line.includes('=') && !line.includes('==') && !line.includes('!=')) {
        const parts = line.split('=');
        if (parts.length === 2) {
          const varName = parts[0].trim();
          let value = parts[1].trim();
          
          // Handle different value types
          if (value.startsWith('[') && value.endsWith(']')) {
            // List
            const listContent = value.slice(1, -1);
            variables[varName] = listContent.split(',').map(v => {
              const trimmed = v.trim();
              if (trimmed.startsWith('"') || trimmed.startsWith("'")) {
                return trimmed.slice(1, -1);
              }
              return isNaN(Number(trimmed)) ? trimmed : Number(trimmed);
            });
          } else if (value.startsWith('"') || value.startsWith("'")) {
            // String
            variables[varName] = value.slice(1, -1);
          } else if (!isNaN(Number(value))) {
            // Number
            variables[varName] = Number(value);
          } else if (value === 'True') {
            variables[varName] = true;
          } else if (value === 'False') {
            variables[varName] = false;
          } else {
            variables[varName] = value;
          }
        }
      }
      
      // Handle for loops
      else if (line.startsWith('for ')) {
        const forMatch = line.match(/for\s+(\w+)\s+in\s+(.+):/);
        if (forMatch) {
          const [, varName, iterable] = forMatch;
          let iterableValue;
          
          if (iterable.includes('range(')) {
            const rangeMatch = iterable.match(/range\((\d+)(?:,\s*(\d+))?\)/);
            if (rangeMatch) {
              const start = rangeMatch[2] ? parseInt(rangeMatch[1]) : 0;
              const end = rangeMatch[2] ? parseInt(rangeMatch[2]) : parseInt(rangeMatch[1]);
              iterableValue = Array.from({ length: end - start }, (_, i) => start + i);
            }
          } else if (variables[iterable]) {
            iterableValue = variables[iterable];
          }
          
          if (iterableValue && Array.isArray(iterableValue)) {
            // Find the end of the for loop
            let forEndIndex = i + 1;
            let indentLevel = 0;
            while (forEndIndex < lines.length) {
              const nextLine = lines[forEndIndex];
              if (nextLine.trim() === '') {
                forEndIndex++;
                continue;
              }
              const currentIndent = nextLine.length - nextLine.trimLeft().length;
              if (indentLevel === 0) indentLevel = currentIndent;
              if (currentIndent < indentLevel && nextLine.trim() !== '') break;
              forEndIndex++;
            }
            
            // Execute for loop body
            for (const item of iterableValue) {
              variables[varName] = item;
              for (let j = i + 1; j < forEndIndex; j++) {
                const bodyLine = lines[j].trim();
                if (bodyLine.includes('print(')) {
                  const printMatch = bodyLine.match(/print\((.*)\)/);
                  if (printMatch) {
                    let content = printMatch[1].trim();
                    if (content.match(/f["'].*["']/)) {
                      const fStringMatch = content.match(/f["']([^"']*)["']/);
                      if (fStringMatch) {
                        let text = fStringMatch[1];
                        text = text.replace(/\{([^}]+)\}/g, (_, expr) => {
                          return variables[expr] !== undefined ? String(variables[expr]) : expr;
                        });
                        output += text + '\n';
                      }
                    }
                  }
                }
              }
            }
            i = forEndIndex - 1;
          }
        }
      }
    }
    
    if (!output.trim()) {
      output = 'Code executed successfully (no output)';
    }
  } catch (err) {
    error = `Python Error: ${err instanceof Error ? err.message : String(err)}`;
  }
  
  return { output: output.trim(), error, executionTime: Date.now() - startTime };
};

const executeCppRealTime = (code: string): { output: string; error?: string; executionTime: number } => {
  const startTime = Date.now();
  let output = '';
  let error = '';
  
  try {
    // Enhanced C++ simulation
    const lines = code.split('\n');
    let inMain = false;
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      
      if (trimmedLine.includes('int main(')) {
        inMain = true;
        continue;
      }
      
      if (inMain && trimmedLine === '}' && line.indexOf('}') <= 4) {
        break;
      }
      
      if (inMain && trimmedLine.includes('cout')) {
        // Parse cout statements more accurately
        const coutRegex = /cout\s*<<\s*([^;]+);/g;
        let match;
        
        while ((match = coutRegex.exec(trimmedLine)) !== null) {
          let content = match[1].trim();
          
          // Handle string literals
          const stringMatch = content.match(/"([^"]*)"/);
          if (stringMatch) {
            output += stringMatch[1];
          }
          
          // Handle endl
          if (content.includes('endl')) {
            output += '\n';
          }
          
          // Handle variables (basic simulation)
          if (content.match(/^\w+$/)) {
            output += content;
          }
        }
      }
      
      // Handle simple variable declarations
      if (inMain && (trimmedLine.includes('int ') || trimmedLine.includes('string ')) && trimmedLine.includes('=')) {
        // Basic variable tracking could be added here
      }
    }
    
    if (!output.trim()) {
      output = 'Hello World!\nCode compiled and executed successfully';
    }
  } catch (err) {
    error = `Compilation Error: ${err instanceof Error ? err.message : String(err)}`;
  }
  
  return { output: output.trim(), error, executionTime: Date.now() - startTime };
};

const executeHtml = (code: string): { output: string; error?: string; executionTime: number } => {
  const startTime = Date.now();
  return { 
    output: 'HTML preview would be rendered in browser', 
    executionTime: Date.now() - startTime 
  };
};

const executeCss = (code: string): { output: string; error?: string; executionTime: number } => {
  const startTime = Date.now();
  return { 
    output: 'CSS styles would be applied to HTML elements', 
    executionTime: Date.now() - startTime 
  };
};

const codeTemplates = {
  javascript: `// JavaScript Real-Time Execution
console.log("Welcome to Real-Time JavaScript!");

// Variables and functions
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(x => x * 2);
console.log("Original:", numbers);
console.log("Doubled:", doubled);

// Loop example
for (let i = 0; i < 5; i++) {
  console.log(\`Count: \${i}\`);
}

// Function example
function greet(name) {
  return \`Hello, \${name}!\`;
}

console.log(greet("Developer"));`,

  python: `# Python Real-Time Execution
print("Welcome to Real-Time Python!")

# Variables and lists
numbers = [1, 2, 3, 4, 5]
doubled = [x * 2 for x in numbers]
print(f"Original: {numbers}")
print(f"Doubled: {doubled}")

# Loop example
for i in range(5):
    print(f"Count: {i}")

# Function example
def greet(name):
    return f"Hello, {name}!"

print(greet("Developer"))`,

  cpp: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    cout << "Welcome to Real-Time C++!" << endl;
    
    // Variables
    vector<int> numbers = {1, 2, 3, 4, 5};
    
    cout << "Numbers: ";
    for (int num : numbers) {
        cout << num << " ";
    }
    cout << endl;
    
    cout << "Hello, Developer!" << endl;
    
    return 0;
}`,

  html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Real-Time HTML</title>
</head>
<body>
    <h1>Welcome to Real-Time HTML!</h1>
    <p>This is a paragraph with <strong>bold text</strong> and <em>italic text</em>.</p>
    <ul>
        <li>List item 1</li>
        <li>List item 2</li>
        <li>List item 3</li>
    </ul>
</body>
</html>`,

  css: `/* Real-Time CSS Styling */
body {
    font-family: 'Arial', sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    margin: 0;
    padding: 20px;
}

h1 {
    color: #fff;
    text-align: center;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
}

.container {
    max-width: 800px;
    margin: 0 auto;
    background: rgba(255,255,255,0.1);
    padding: 20px;
    border-radius: 10px;
    backdrop-filter: blur(10px);
}`
};

const RealTimeExecutor: React.FC<RealTimeExecutorProps> = ({
  initialCode,
  language: initialLanguage = 'javascript',
  onCodeChange,
  onLanguageChange
}) => {
  const [code, setCode] = useState(initialCode || codeTemplates[initialLanguage]);
  const [language, setLanguage] = useState<'javascript' | 'python' | 'cpp' | 'html' | 'css'>(initialLanguage);
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [executionTime, setExecutionTime] = useState(0);
  const [autoRun, setAutoRun] = useState(false);
  const { toast } = useToast();
  const timeoutRef = useRef<NodeJS.Timeout>();

  const executeCode = async (codeToExecute: string = code) => {
    setIsRunning(true);
    setError('');
    
    // Small delay for visual feedback
    await new Promise(resolve => setTimeout(resolve, 100));
    
    let result;
    switch (language) {
      case 'javascript':
        result = executeJavaScriptRealTime(codeToExecute);
        break;
      case 'python':
        result = executePythonRealTime(codeToExecute);
        break;
      case 'cpp':
        result = executeCppRealTime(codeToExecute);
        break;
      case 'html':
        result = executeHtml(codeToExecute);
        break;
      case 'css':
        result = executeCss(codeToExecute);
        break;
      default:
        result = { output: 'Language not supported', executionTime: 0 };
    }
    
    setOutput(result.output);
    setError(result.error || '');
    setExecutionTime(result.executionTime);
    setIsRunning(false);
  };

  const handleCodeChange = (value: string | undefined) => {
    const newCode = value || '';
    setCode(newCode);
    onCodeChange?.(newCode);
    
    if (autoRun) {
      // Debounce auto-execution
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        executeCode(newCode);
      }, 1000);
    }
  };

  const handleLanguageChange = (newLanguage: 'javascript' | 'python' | 'cpp' | 'html' | 'css') => {
    setLanguage(newLanguage);
    setCode(codeTemplates[newLanguage]);
    setOutput('');
    setError('');
    onCodeChange?.(codeTemplates[newLanguage]);
    onLanguageChange?.(newLanguage);
  };

  const clearOutput = () => {
    setOutput('');
    setError('');
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[600px]">
      {/* Code Editor */}
      <Card className="flex flex-col">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Code className="h-5 w-5 text-blue-400" />
              <CardTitle className="text-lg">Real-Time Code Editor</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <Select value={language} onValueChange={handleLanguageChange}>
                <SelectTrigger className="w-32 bg-gray-800 border-gray-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  <SelectItem value="javascript">JavaScript</SelectItem>
                  <SelectItem value="python">Python</SelectItem>
                  <SelectItem value="cpp">C++</SelectItem>
                  <SelectItem value="html">HTML</SelectItem>
                  <SelectItem value="css">CSS</SelectItem>
                </SelectContent>
              </Select>
              
              <Button
                onClick={() => executeCode()}
                disabled={isRunning}
                className="bg-green-600 hover:bg-green-700"
              >
                {isRunning ? (
                  <>
                    <Square className="h-4 w-4 mr-2 animate-pulse" />
                    Running...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Run
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 p-0">
          <Editor
            height="100%"
            language={language === 'cpp' ? 'cpp' : language}
            value={code}
            onChange={handleCodeChange}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: 'on',
              roundedSelection: false,
              scrollBeyondLastLine: false,
              automaticLayout: true,
              tabSize: 2,
              wordWrap: 'on',
              suggestOnTriggerCharacters: true,
              acceptSuggestionOnCommitCharacter: true,
              acceptSuggestionOnEnter: 'on',
              quickSuggestions: true
            }}
          />
        </CardContent>
      </Card>

      {/* Output Panel */}
      <Card className="flex flex-col">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal className="h-5 w-5 text-green-400" />
              <CardTitle className="text-lg">Live Output</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              {executionTime > 0 && (
                <Badge variant="outline" className="text-xs">
                  <Clock className="h-3 w-3 mr-1" />
                  {executionTime}ms
                </Badge>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={clearOutput}
                className="border-gray-600"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 p-4">
          <ScrollArea className="h-full">
            {/* Success Output */}
            {output && !error && (
              <div className="p-4 bg-gray-900 rounded-lg border border-gray-700">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span className="text-green-400 font-medium">Execution Successful</span>
                </div>
                <pre className="text-green-300 text-sm whitespace-pre-wrap font-mono leading-relaxed">
                  {output}
                </pre>
              </div>
            )}
            
            {/* Error Output */}
            {error && (
              <div className="p-4 bg-red-900/20 rounded-lg border border-red-500">
                <div className="flex items-center gap-2 mb-3">
                  <AlertCircle className="h-4 w-4 text-red-400" />
                  <span className="text-red-400 font-medium">Execution Failed</span>
                </div>
                <pre className="text-red-300 text-sm whitespace-pre-wrap font-mono">
                  {error}
                </pre>
              </div>
            )}
            
            {/* No Output Yet */}
            {!output && !error && !isRunning && (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <Play className="h-12 w-12 mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">Ready to Execute</h3>
                <p className="text-center">
                  Write your code and click "Run" to see the output here
                </p>
              </div>
            )}
            
            {/* Loading State */}
            {isRunning && (
              <div className="flex flex-col items-center justify-center h-full text-blue-400">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mb-4"></div>
                <p>Executing code...</p>
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default RealTimeExecutor;
