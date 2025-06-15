
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Eye, Star } from 'lucide-react';

interface TrendingSnippet {
  id: string;
  title: string;
  author: string;
  language: string;
  views: number;
  stars: number;
  code: string;
  description: string;
}

const trendingSnippets: TrendingSnippet[] = [
  {
    id: '1',
    title: 'Fibonacci Generator',
    author: 'Sarah Chen',
    language: 'javascript',
    views: 1234,
    stars: 89,
    code: `function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log("Fibonacci sequence:");
for (let i = 0; i < 10; i++) {
  console.log(\`F(\${i}) = \${fibonacci(i)}\`);
}`,
    description: 'Classic recursive Fibonacci implementation'
  },
  {
    id: '2',
    title: 'Quick Sort Algorithm',
    author: 'Alex Rodriguez',
    language: 'python',
    views: 892,
    stars: 67,
    code: `def quicksort(arr):
    if len(arr) <= 1:
        return arr
    
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    
    return quicksort(left) + middle + quicksort(right)

# Test the algorithm
test_array = [64, 34, 25, 12, 22, 11, 90]
print("Original array:", test_array)
print("Sorted array:", quicksort(test_array))`,
    description: 'Efficient quicksort implementation with explanation'
  },
  {
    id: '3',
    title: 'Binary Search Tree',
    author: 'John Doe',
    language: 'cpp',
    views: 567,
    stars: 45,
    code: `#include <iostream>

struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

class BST {
public:
    TreeNode* insert(TreeNode* root, int val) {
        if (!root) return new TreeNode(val);
        
        if (val < root->val) {
            root->left = insert(root->left, val);
        } else {
            root->right = insert(root->right, val);
        }
        return root;
    }
    
    void inorder(TreeNode* root) {
        if (root) {
            inorder(root->left);
            std::cout << root->val << " ";
            inorder(root->right);
        }
    }
};

int main() {
    BST bst;
    TreeNode* root = nullptr;
    
    root = bst.insert(root, 50);
    root = bst.insert(root, 30);
    root = bst.insert(root, 70);
    root = bst.insert(root, 20);
    root = bst.insert(root, 40);
    
    std::cout << "Inorder traversal: ";
    bst.inorder(root);
    std::cout << std::endl;
    
    return 0;
}`,
    description: 'Binary Search Tree implementation in C++'
  }
];

interface TrendingSnippetsProps {
  onLoadSnippet: (snippet: TrendingSnippet) => void;
}

const TrendingSnippets: React.FC<TrendingSnippetsProps> = ({ onLoadSnippet }) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <TrendingUp className="h-5 w-5 text-orange-400" />
            <CardTitle className="text-lg">Trending Code Snippets</CardTitle>
          </div>
          <Badge variant="outline" className="bg-orange-500/20 text-orange-300 border-orange-500">
            Featured
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {trendingSnippets.map((snippet) => (
            <Card key={snippet.id} className="hover:border-blue-500/50 transition-colors cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">{snippet.title}</CardTitle>
                  <Badge variant="outline" className="text-xs">
                    {snippet.language}
                  </Badge>
                </div>
                <p className="text-xs text-gray-400">by {snippet.author}</p>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-gray-300 mb-3">{snippet.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {snippet.views}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="h-3 w-3" />
                      {snippet.stars}
                    </span>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onLoadSnippet(snippet)}
                    className="text-xs"
                  >
                    Load
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TrendingSnippets;
export type { TrendingSnippet };
