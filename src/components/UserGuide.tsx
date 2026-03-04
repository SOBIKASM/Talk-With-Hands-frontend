import React from 'react';
import { Book, Hand, Eye, CheckCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface SignExample {
  letter: string;
  description: string;
  tips: string[];
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export default function UserGuide() {
  const signExamples: SignExample[] = [
    {
      letter: 'A',
      description: 'Make a fist with your thumb alongside your fingers',
      tips: ['Keep thumb pressed against the side of your index finger', 'Ensure all fingers are tightly closed'],
      difficulty: 'Easy'
    },
    {
      letter: 'B',
      description: 'Hold four fingers straight up with thumb tucked across palm',
      tips: ['Keep fingers straight and together', 'Thumb should be tucked behind fingers'],
      difficulty: 'Easy'
    },
    {
      letter: 'C',
      description: 'Curve your fingers to form the shape of the letter C',
      tips: ['Make a clear C shape with thumb and fingers', 'Keep consistent curve throughout'],
      difficulty: 'Easy'
    },
    {
      letter: 'I',
      description: 'Extend your pinky finger while making a fist',
      tips: ['Only the pinky should be extended', 'Keep other fingers in a tight fist'],
      difficulty: 'Easy'
    },
    {
      letter: 'L',
      description: 'Extend thumb and index finger to form an L shape',
      tips: ['Make a clear 90-degree angle', 'Keep other fingers folded down'],
      difficulty: 'Medium'
    },
    {
      letter: 'Y',
      description: 'Extend thumb and pinky while keeping other fingers down',
      tips: ['Make sure thumb and pinky are clearly extended', 'Keep middle fingers tucked'],
      difficulty: 'Medium'
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-500';
      case 'Medium': return 'bg-yellow-500';
      case 'Hard': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getSignPlaceholder = (letter: string) => {
    return `https://via.placeholder.com/200x200/f3f4f6/6b7280?text=${letter}`;
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="gradient-text mb-4">User Guide</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Learn how to use the sign language recognition system effectively and practice with sample signs
        </p>
      </div>

      {/* Getting Started */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Book className="h-5 w-5" />
            <span>Getting Started</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="mb-4">Setup Instructions</h4>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 gradient-highlight rounded-full flex items-center justify-center text-white flex-shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <p className="mb-1">Allow camera permissions when prompted</p>
                    <p className="text-sm text-muted-foreground">The app needs access to your camera to detect hand gestures</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 gradient-highlight rounded-full flex items-center justify-center text-white flex-shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <p className="mb-1">Position yourself in good lighting</p>
                    <p className="text-sm text-muted-foreground">Ensure your hands are well-lit and visible</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 gradient-highlight rounded-full flex items-center justify-center text-white flex-shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <p className="mb-1">Keep hands in frame</p>
                    <p className="text-sm text-muted-foreground">Make sure your hands are clearly visible in the camera feed</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 gradient-highlight rounded-full flex items-center justify-center text-white flex-shrink-0 mt-0.5">
                    4
                  </div>
                  <div>
                    <p className="mb-1">Hold gestures steady</p>
                    <p className="text-sm text-muted-foreground">Keep your hand position stable for 1-2 seconds for best results</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <ImageWithFallback
                src="/love.jpg"
                alt="Sign language demonstration"
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tips for Better Recognition */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Eye className="h-5 w-5" />
            <span>Tips for Better Recognition</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted rounded-lg">
              <Hand className="h-8 w-8 mx-auto mb-3 text-primary" />
              <h4 className="mb-2">Hand Position</h4>
              <p className="text-sm text-muted-foreground">Keep your dominant hand centered in the camera frame</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <Eye className="h-8 w-8 mx-auto mb-3 text-primary" />
              <h4 className="mb-2">Lighting</h4>
              <p className="text-sm text-muted-foreground">Use natural light or bright indoor lighting for best results</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <CheckCircle className="h-8 w-8 mx-auto mb-3 text-primary" />
              <h4 className="mb-2">Steady Hands</h4>
              <p className="text-sm text-muted-foreground">Hold gestures steady for at least 1-2 seconds</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sample Signs */}
      <Card>
        <CardHeader>
          <CardTitle>Sample Signs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {signExamples.map((sign) => (
              <div key={sign.letter} className="border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 gradient-highlight rounded-full flex items-center justify-center text-white">
                      {sign.letter}
                    </div>
                    <h4>Letter {sign.letter}</h4>
                  </div>
                  <Badge className={`text-white ${getDifficultyColor(sign.difficulty)}`}>
                    {sign.difficulty}
                  </Badge>
                </div>
                
                <div className="mb-4">
                  <ImageWithFallback
                    src={`/alphabet_images/${sign.letter}.jpg`}
                    alt={`Sign language letter ${sign.letter}`}
                    className="w-full h-full object-cover rounded-lg bg-muted"
                  />
                </div>
                
                <p className="text-sm mb-3">{sign.description}</p>
                
                <div>
                  <h5 className="text-sm mb-2">Tips:</h5>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    {sign.tips.map((tip, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span>•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

     
    </div>
  );
}