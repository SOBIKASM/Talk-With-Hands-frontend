import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Play, Square, Camera, AlertCircle, RotateCcw, BookOpen, MessageSquare, Type, Tally3 } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { ImageWithFallback } from './figma/ImageWithFallback'; // Assuming this component is available

interface StoredItem {
  id: string;
  content: string;
  timestamp: number;
  accuracy?: number;
}

// Helper function to get the image path
const getISLImage = (sign: string) => {
  return `/alphabet_images/${sign.toUpperCase()}.jpg`;
};

// Helper to join stored items for display
const joinStoredItems = (items: StoredItem[], separator: string) => {
  return items.map(item => item.content).join(separator);
};

export default function SignLanguageRecognition() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wsRef = useRef<WebSocket | null>(null);

  const [isRecording, setIsRecording] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [currentLetter, setCurrentLetter] = useState('');
  const [currentWord, setCurrentWord] = useState('');
  const [currentSentence, setCurrentSentence] = useState('');
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const [letters, setLetters] = useState<StoredItem[]>([]);
  const [words, setWords] = useState<StoredItem[]>([]);
  const [sentences, setSentences] = useState<StoredItem[]>([]);

  // --- Derived Value: Current Word with Live Letter ---
  // This helps visualize the construction before 'K' is pressed.
  const wordInConstruction = currentWord + currentLetter;

  // --- Derived Value: Image List from currentSentence ---
  const sentenceImageSigns = useMemo(() => {
    if (!currentSentence) return [];
    
    // Split the currentSentence by spaces to get individual words/letters
    const signs = currentSentence.split(' ').filter(s => s.length > 0);
    
    // Break down words into individual letters if not a known gesture word
    return signs.flatMap(sign => {
        if (["HI", "MY", "YES", "NO"].includes(sign.toUpperCase())) { // Expanded list of possible full words
            return [sign];
        } else {
            return sign.split('');
        }
    });
  }, [currentSentence]);


  // Start camera & WebSocket (Logic remains the same)
  const startCamera = async () => {
    try {
      setError('');
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
        audio: false
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play().catch(() => { });
      }
      setIsRecording(true);

      // Open WebSocket
      wsRef.current = new WebSocket('ws://localhost:8000/ws');
      wsRef.current.onopen = () => console.log('WebSocket connected');
      wsRef.current.onmessage = (event: { data: string; }) => {
        const data = JSON.parse(event.data);
        const receivedLetter = data.letter || '';

        // Update current letter
        setCurrentLetter(receivedLetter);

        // Backend gesture handling logic (kept same as previous version)
        if (receivedLetter === "RIGHT") {
          if (currentLetter) {
            setCurrentWord((prev) => prev + currentLetter);
            setCurrentLetter('');
          }
        } else if (receivedLetter === "SPACE") {
          if (currentWord) {
            setCurrentSentence((prev) => (prev ? prev + ' ' : '') + currentWord);
            setCurrentWord('');
          }
        } else if (receivedLetter === "RESET") {
          setCurrentLetter('');
          setCurrentWord('');
          setCurrentSentence('');
          setSentences([]);
          setLetters([]);
          setWords([]);
        } else if (["MY"].includes(receivedLetter)) {
          setCurrentSentence((prev) => (prev ? prev + ' ' : '') + receivedLetter);
          setCurrentLetter('');
        } else if (receivedLetter) {
          setCurrentLetter(receivedLetter);
          setLetters((prev) => [{ id: Date.now().toString(), content: receivedLetter, timestamp: Date.now() }, ...prev.slice(0, 9)]);
        }

        if (data.sentence) setCurrentSentence(data.sentence);
      };

      wsRef.current.onclose = () => console.log('WebSocket disconnected');
    } catch (err) {
      setError('Failed to access camera. Please check permissions.');
      console.error(err);
    }
  };

  // Stop Camera, Capture Frame, and Auto Capture Logic (Kept same)
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track: { stop: () => any; }) => track.stop());
      setStream(null);
    }
    if (videoRef.current) videoRef.current.srcObject = null;
    wsRef.current?.close();
    wsRef.current = null;
    setIsRecording(false);
    setCurrentLetter('');
    setCurrentWord('');
    setCurrentSentence('');
  };

  const resetData = () => {
    setLetters([]);
    setWords([]);
    setSentences([]);
    setCurrentLetter('');
    setCurrentWord('');
    setCurrentSentence('');
  };

  const captureFrame = () => {
    if (!videoRef.current || !canvasRef.current || !wsRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const video = videoRef.current;
    if (!ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);

    canvas.toBlob((blob: Blob | null) => {
      if (blob && wsRef.current?.readyState === WebSocket.OPEN) {
        const reader = new FileReader();
        reader.onloadend = () => {
          wsRef.current?.send(JSON.stringify({ frame: reader.result }));
        };
        reader.readAsDataURL(blob);
      }
    }, 'image/jpeg', 0.8);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    const videoReady = (videoRef.current?.readyState ?? 0) >= 2;
    if (isRecording && videoReady) {
      interval = setInterval(() => captureFrame(), 200); // capture every 0.2s (~5 FPS)
    }
    return () => clearInterval(interval);
  }, [isRecording]);


  // Key press for manual storing logic
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const id = Date.now().toString();

      if (event.key.toLowerCase() === 'k') {
        // 'K': Confirm currentLetter, add to currentWord, and clear currentLetter
        if (currentLetter) {
          setCurrentWord((prev) => prev + currentLetter);
          setCurrentLetter('');
        }
      } else if (event.key.toLowerCase() === 'w') {
        // 'W': Confirm currentWord, add to sentences, and clear currentWord
        if (currentWord) {
          const newWord: StoredItem = { id, content: currentWord, timestamp: Date.now() };
          setWords((prev) => [newWord, ...prev.slice(0, 9)]); // Store confirmed word
          
          // Append to current sentence
          setCurrentSentence((prev) => (prev ? prev + ' ' : '') + currentWord);
          setCurrentWord(''); // Clear the word after confirming it
        }
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentLetter, currentWord, currentSentence]);

  return (

    <div className="space-y-6">
      <div className="text-center">
        <h2 className="gradient-text mb-4">Sign Language Recognition</h2>
        <p className="text-muted-foreground">
          Press **'K'** to confirm a **letter** into the current word. Press **'W'** to confirm the current **word** into the sentence.
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* --- Camera Feed Card --- */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Camera className="h-5 w-5" />
              <span>Camera Feed</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-[4/3]">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
                style={{ transform: 'scaleX(-1)' }} // Mirror the video
              />
              {!isRecording && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                  <div className="text-center text-white">
                    <Camera className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Camera not active</p>
                  </div>
                </div>
              )}
              {isProcessing && (
                <div className="absolute top-4 right-4 bg-yellow-500 text-white px-3 py-1 rounded-full">
                  Processing...
                </div>
              )}
            </div>

            <div className="flex justify-center space-x-4 mt-4">
              {!isRecording ? (
                <Button onClick={startCamera} className="gradient-highlight text-white hover:opacity-90">
                  <Play className="h-4 w-4 mr-2" /> Start Recognition
                </Button>
              ) : (
                <Button onClick={stopCamera} variant="destructive">
                  <Square className="h-4 w-4 mr-2" /> Stop Recognition
                </Button>
              )}
              <Button onClick={resetData} variant="outline">
                <RotateCcw className="h-4 w-4 mr-2" /> Reset All Data
              </Button>
            </div>
            <canvas ref={canvasRef} className="hidden" />
          </CardContent>
        </Card>

        {/* --- Recognition Results (Unified) --- */}
        <Card>
          <CardHeader>
            <CardTitle>Live Prediction</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            
            {/* Letter */}
            <div className="flex items-center space-x-4 p-3 bg-gray-100 dark:bg-gray-800 rounded">
                <Type className="h-6 w-6 text-blue-500 flex-shrink-0" />
                <div>
                    <p className="text-sm font-medium text-muted-foreground">Current Letter (Press 'K'):</p>
                    <p className="text-3xl font-black text-foreground">{currentLetter || '—'}</p>
                </div>
            </div>

            {/* Word */}
            <div className="flex items-center space-x-4 p-3 bg-gray-100 dark:bg-gray-800 rounded">
                <Tally3 className="h-6 w-6 text-green-500 flex-shrink-0" />
                <div>
                    <p className="text-sm font-medium text-muted-foreground">Current Word (Press 'W'):</p>
                    <p className="text-xl font-bold text-foreground">
                        {/* Show confirmed word + current letter being built */}
                        {currentWord}
                        <span className="text-blue-500">{currentLetter}</span>
                        {!wordInConstruction && <span className="text-muted-foreground">—</span>}
                    </p>
                </div>
            </div>

            {/* Sentence */}
            <div className="flex items-center space-x-4 p-3 bg-gray-100 dark:bg-gray-800 rounded">
                <MessageSquare className="h-6 w-6 text-purple-500 flex-shrink-0" />
                <div className="overflow-x-auto w-full">
                    <p className="text-sm font-medium text-muted-foreground">Current Sentence:</p>
                    <p className="text-lg font-medium text-foreground whitespace-nowrap">
                        {currentSentence || '—'}
                    </p>
                </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* --- ISL Recognised Sign - Sentence Visualisation --- */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BookOpen className="h-5 w-5" />
            <span>ISL Visualisation ({sentenceImageSigns.length} Signs)</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            {sentenceImageSigns.length > 0 ? (
              <div className="flex flex-wrap justify-center gap-2 p-3 border rounded-lg bg-gray-50 dark:bg-gray-800 max-h-96 overflow-y-auto">
                {sentenceImageSigns.map((sign, index) => (
                  <div key={index} className="text-center flex-shrink-0 w-20">
                    <ImageWithFallback
                      src={getISLImage(sign)}
                      alt={`ISL sign for ${sign}`}
                      // Reduced image size: w-16 h-16
                      className="w-16 h-16 object-contain rounded border border-primary/50 mx-auto"
                    />
                    <p className="text-xs font-medium mt-1 text-foreground">{sign}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-muted-foreground">
                <Camera className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Start signing! The visual signs for your sentence will appear here.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}