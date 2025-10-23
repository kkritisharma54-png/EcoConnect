import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TreePine, Award, RotateCcw, CheckCircle, Eye, Heart } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface EndangeredSpeciesMemoryProps {
  onComplete: (score: number) => void;
  onBack: () => void;
}

interface Species {
  id: string;
  name: string;
  emoji: string;
  habitat: string;
  fact: string;
  status: string;
}

interface CardType {
  id: string;
  speciesId: string;
  type: 'species' | 'habitat';
  content: string;
  emoji: string;
  matched: boolean;
  flipped: boolean;
}

const EndangeredSpeciesMemory = ({ onComplete, onBack }: EndangeredSpeciesMemoryProps) => {
  const [cards, setCards] = useState<CardType[]>([]);
  const [flippedCards, setFlippedCards] = useState<string[]>([]);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [moves, setMoves] = useState(0);
  const [score, setScore] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [showFact, setShowFact] = useState<Species | null>(null);

  const species: Species[] = [
    {
      id: 'tiger',
      name: 'Bengal Tiger',
      emoji: '🐅',
      habitat: 'Tropical Forest',
      fact: 'Only about 2,500 Bengal tigers remain in the wild, primarily in India.',
      status: 'Endangered'
    },
    {
      id: 'panda',
      name: 'Giant Panda',
      emoji: '🐼',
      habitat: 'Bamboo Forest',
      fact: 'Giant pandas spend 14 hours a day eating bamboo and have pseudo-thumbs to grasp it.',
      status: 'Vulnerable'
    },
    {
      id: 'elephant',
      name: 'African Elephant',
      emoji: '🐘',
      habitat: 'African Savanna',
      fact: 'African elephants are ecosystem engineers, creating water holes used by other wildlife.',
      status: 'Endangered'
    },
    {
      id: 'rhino',
      name: 'Black Rhino',
      emoji: '🦏',
      habitat: 'African Grassland',
      fact: 'Black rhinos have excellent hearing and smell but poor eyesight.',
      status: 'Critically Endangered'
    },
    {
      id: 'orangutan',
      name: 'Orangutan',
      emoji: '🦧',
      habitat: 'Rainforest Canopy',
      fact: 'Orangutans share 97% of their DNA with humans and use tools in the wild.',
      status: 'Critically Endangered'
    },
    {
      id: 'turtle',
      name: 'Sea Turtle',
      emoji: '🐢',
      habitat: 'Ocean Waters',
      fact: 'Sea turtles have been around for over 100 million years but now face extinction.',
      status: 'Endangered'
    }
  ];

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    const gameCards: CardType[] = [];
    
    // Create pairs of species and habitat cards
    species.forEach(sp => {
      gameCards.push({
        id: `species-${sp.id}`,
        speciesId: sp.id,
        type: 'species',
        content: sp.name,
        emoji: sp.emoji,
        matched: false,
        flipped: false
      });
      
      gameCards.push({
        id: `habitat-${sp.id}`,
        speciesId: sp.id,
        type: 'habitat',
        content: sp.habitat,
        emoji: '🌍',
        matched: false,
        flipped: false
      });
    });

    // Shuffle cards
    const shuffled = gameCards.sort(() => Math.random() - 0.5);
    setCards(shuffled);
  };

  const handleCardClick = (cardId: string) => {
    if (flippedCards.length >= 2) return;
    if (flippedCards.includes(cardId)) return;
    
    const card = cards.find(c => c.id === cardId);
    if (!card || card.matched) return;

    const newFlipped = [...flippedCards, cardId];
    setFlippedCards(newFlipped);
    
    // Update card state
    setCards(prev => prev.map(c => 
      c.id === cardId ? { ...c, flipped: true } : c
    ));

    if (newFlipped.length === 2) {
      setMoves(prev => prev + 1);
      
      const [firstId, secondId] = newFlipped;
      const firstCard = cards.find(c => c.id === firstId);
      const secondCard = cards.find(c => c.id === secondId);
      
      if (firstCard && secondCard && firstCard.speciesId === secondCard.speciesId) {
        // Match found!
        setMatchedPairs(prev => prev + 1);
        setScore(prev => prev + 50);
        
        // Show species fact
        const matchedSpecies = species.find(s => s.id === firstCard.speciesId);
        if (matchedSpecies) {
          setShowFact(matchedSpecies);
        }
        
        setTimeout(() => {
          setCards(prev => prev.map(c => 
            c.speciesId === firstCard.speciesId 
              ? { ...c, matched: true, flipped: false } 
              : c
          ));
          setFlippedCards([]);
          setShowFact(null);
        }, 2000);
      } else {
        // No match
        setTimeout(() => {
          setCards(prev => prev.map(c => 
            newFlipped.includes(c.id) 
              ? { ...c, flipped: false } 
              : c
          ));
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  useEffect(() => {
    if (matchedPairs === species.length) {
      const bonusScore = Math.max(0, (50 - moves) * 5); // Bonus for efficiency
      setScore(prev => prev + bonusScore);
      setGameComplete(true);
      setTimeout(() => onComplete(score + bonusScore), 2000);
    }
  }, [matchedPairs, species.length, moves, score, onComplete]);

  const resetGame = () => {
    setMatchedPairs(0);
    setMoves(0);
    setScore(0);
    setGameComplete(false);
    setFlippedCards([]);
    setShowFact(null);
    initializeGame();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl bg-white max-h-[90vh] overflow-y-auto">
        <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <TreePine size={24} />
                Endangered Species Memory Game
              </CardTitle>
              <p className="text-green-100 mt-1">Match species with their habitats!</p>
            </div>
            <Button variant="ghost" onClick={onBack} className="text-white hover:bg-white/20">
              ✕
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <AnimatePresence mode="wait">
            {!gameComplete ? (
              <motion.div
                key="game"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* Game Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <Card className="bg-green-50">
                    <CardContent className="p-4 text-center">
                      <Award className="text-green-600 mx-auto mb-2" size={24} />
                      <div className="text-2xl text-green-600">{score}</div>
                      <div className="text-sm text-green-600">Score</div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-blue-50">
                    <CardContent className="p-4 text-center">
                      <Eye className="text-blue-600 mx-auto mb-2" size={24} />
                      <div className="text-2xl text-blue-600">{moves}</div>
                      <div className="text-sm text-blue-600">Moves</div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-purple-50">
                    <CardContent className="p-4 text-center">
                      <Heart className="text-purple-600 mx-auto mb-2" size={24} />
                      <div className="text-2xl text-purple-600">{matchedPairs}/{species.length}</div>
                      <div className="text-sm text-purple-600">Pairs</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Memory Cards Grid */}
                <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                  {cards.map((card) => (
                    <motion.div
                      key={card.id}
                      className="aspect-square"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div
                        className={`relative w-full h-full rounded-lg cursor-pointer transition-all duration-300 ${
                          card.matched
                            ? 'bg-green-100 border-2 border-green-500'
                            : card.flipped
                              ? 'bg-blue-50 border-2 border-blue-300'
                              : 'bg-gray-100 border-2 border-gray-300 hover:border-gray-400'
                        }`}
                        onClick={() => handleCardClick(card.id)}
                      >
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-2">
                          {card.matched || card.flipped ? (
                            <>
                              <div className="text-2xl mb-1">{card.emoji}</div>
                              <div className="text-xs text-center font-medium text-gray-700">
                                {card.content}
                              </div>
                            </>
                          ) : (
                            <div className="text-4xl text-gray-400">?</div>
                          )}
                        </div>
                        
                        {card.matched && (
                          <div className="absolute top-1 right-1">
                            <CheckCircle className="text-green-600" size={16} />
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Species Fact Display */}
                {showFact && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border-2 border-green-200"
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-3xl">{showFact.emoji}</div>
                      <div className="flex-1">
                        <h4 className="font-medium text-green-800 mb-1">
                          {showFact.name} - {showFact.status}
                        </h4>
                        <p className="text-green-700 text-sm mb-2">{showFact.fact}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded-full">
                            🌍 Habitat: {showFact.habitat}
                          </span>
                          <span className="text-xs bg-red-200 text-red-800 px-2 py-1 rounded-full">
                            Status: {showFact.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                <div className="text-center text-sm text-gray-600">
                  💡 Flip cards to match endangered species with their habitats!
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="results"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-6"
              >
                <div className="space-y-4">
                  <CheckCircle className="text-green-600 mx-auto" size={64} />
                  <h2 className="text-2xl font-bold text-gray-800">Conservation Hero!</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
                    <Card className="bg-green-50">
                      <CardContent className="p-4 text-center">
                        <div className="text-3xl text-green-600">{score}</div>
                        <div className="text-sm text-green-600">Final Score</div>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-blue-50">
                      <CardContent className="p-4 text-center">
                        <div className="text-3xl text-blue-600">{moves}</div>
                        <div className="text-sm text-blue-600">Total Moves</div>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-purple-50">
                      <CardContent className="p-4 text-center">
                        <div className="text-3xl text-purple-600">{species.length}</div>
                        <div className="text-sm text-purple-600">Species Learned</div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h4 className="font-medium text-yellow-800 mb-2">🦋 Conservation Tips:</h4>
                    <ul className="text-sm text-yellow-700 text-left space-y-1">
                      <li>• Support wildlife conservation organizations</li>
                      <li>• Reduce plastic use to protect marine life</li>
                      <li>• Choose sustainable products to preserve habitats</li>
                      <li>• Create wildlife-friendly gardens with native plants</li>
                      <li>• Educate others about endangered species</li>
                    </ul>
                  </div>
                </div>

                <div className="flex gap-4 justify-center">
                  <Button onClick={resetGame} variant="outline">
                    <RotateCcw size={16} className="mr-2" />
                    Play Again
                  </Button>
                  <Button onClick={onBack} className="bg-green-600 hover:bg-green-700">
                    <TreePine size={16} className="mr-2" />
                    Claim Rewards
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
};

export default EndangeredSpeciesMemory;