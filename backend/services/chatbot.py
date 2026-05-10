import json
import random
import sys
import re
from datetime import datetime
from rapidfuzz import process, fuzz
from collections import defaultdict

# -----------------------------
# Enhanced Chatbot Class
# -----------------------------
class EnhancedChatbot:
    def __init__(self, intents_file="neural-network-chatbot/intents.json"):
        self.intents_file = intents_file
        self.all_patterns = []
        self.pattern_to_response = {}
        self.pattern_to_intent = {}
        self.context_memory = {}
        self.user_preferences = defaultdict(dict)
        self.conversation_history = []
        self.fallback_responses = [
            "Sorry, I didn't understand your issue.",
            "Could you please rephrase that?",
            "I'm not sure I follow. Can you provide more details?",
            "Let me try to understand better. Could you explain differently?"
        ]
        self.load_intents()
        
    def load_intents(self):
        """Load and validate intents from JSON file"""
        try:
            with open(self.intents_file, "r", encoding="utf-8") as file:
                data = json.load(file)
                
            # Validate intents structure
            if "intents" not in data:
                print("Invalid intents.json format: missing 'intents' key")
                sys.exit(1)
                
            for intent in data["intents"]:
                responses = intent.get("responses", [])
                intent_name = intent.get("tag", "unknown")
                
                for pattern in intent.get("patterns", []):
                    clean_pattern = pattern.lower().strip()
                    # Add synonyms support
                    synonyms = intent.get("synonyms", [])
                    self.all_patterns.append(clean_pattern)
                    self.pattern_to_response[clean_pattern] = responses
                    self.pattern_to_intent[clean_pattern] = intent_name
                    
                    # Add synonym patterns
                    for synonym in synonyms:
                        synonym_pattern = synonym.lower().strip()
                        self.all_patterns.append(synonym_pattern)
                        self.pattern_to_response[synonym_pattern] = responses
                        self.pattern_to_intent[synonym_pattern] = intent_name
                        
            # print(f"[INFO] Loaded {len(self.all_patterns)} patterns successfully")
            
        except FileNotFoundError:
            print(f"Error: {self.intents_file} file not found.")
            sys.exit(1)
        except json.JSONDecodeError:
            print("Error: Invalid JSON format in intents file.")
            sys.exit(1)
            
    def preprocess_message(self, message):
        """Clean and preprocess user message"""
        # Convert to lowercase
        message = message.lower().strip()
        
        # Remove punctuation
        message = re.sub(r'[^\w\s]', '', message)
        
        # Remove extra spaces
        message = re.sub(r'\s+', ' ', message)
        
        # Handle common abbreviations
        abbreviations = {
            "u": "you",
            "ur": "your",
            "pls": "please",
            "plz": "please",
            "thx": "thanks",
            "ty": "thank you",
            "idk": "i don't know",
            "lol": "laughing out loud"
        }
        
        words = message.split()
        message = " ".join([abbreviations.get(word, word) for word in words])
        
        return message
        
    def get_sentiment(self, message):
        """Simple sentiment analysis"""
        positive_words = ['good', 'great', 'awesome', 'nice', 'happy', 'love', 'like', 'thanks', 'thank']
        negative_words = ['bad', 'terrible', 'awful', 'hate', 'dislike', 'sad', 'angry', 'frustrated']
        
        words = message.split()
        sentiment_score = 0
        
        for word in words:
            if word in positive_words:
                sentiment_score += 1
            elif word in negative_words:
                sentiment_score -= 1
                
        if sentiment_score > 0:
            return "positive"
        elif sentiment_score < 0:
            return "negative"
        else:
            return "neutral"
            
    def get_time_based_greeting(self):
        """Return greeting based on time of day"""
        current_hour = datetime.now().hour
        
        if 5 <= current_hour < 12:
            return "Good morning"
        elif 12 <= current_hour < 17:
            return "Good afternoon"
        elif 17 <= current_hour < 22:
            return "Good evening"
        else:
            return "Hello"
            
    def find_best_match(self, message, threshold=70):
        """Enhanced pattern matching with multiple scorers"""
        # Try different scorers for better matching
        scorers = [
            (fuzz.token_sort_ratio, 70),
            (fuzz.partial_ratio, 75),
            (fuzz.ratio, 65)
        ]
        
        best_match = None
        best_score = 0
        
        for scorer, min_threshold in scorers:
            result = process.extractOne(message, self.all_patterns, scorer=scorer)
            
            if result:
                match, score, _ = result
                if score >= min_threshold and score > best_score:
                    best_match = match
                    best_score = score
                    
        # If no good match found, try keyword matching as fallback
        if best_score < threshold:
            best_match, best_score = self.keyword_matching(message)
            
        return best_match, best_score
        
    def keyword_matching(self, message):
        """Fallback keyword-based matching"""
        keywords = {
            'help': 90, 'support': 85, 'assist': 85,
            'price': 80, 'cost': 80, 'money': 75,
            'time': 70, 'when': 75, 'schedule': 70,
            'where': 75, 'location': 80, 'place': 70
        }
        
        best_match = None
        best_score = 0
        
        for pattern in self.all_patterns:
            score = 0
            for keyword, weight in keywords.items():
                if keyword in message and keyword in pattern:
                    score += weight
                    
            if score > best_score:
                best_score = score
                best_match = pattern
                
        return best_match, best_score
        
    def get_contextual_response(self, intent_name, message, user_id="default"):
        """Generate response with context awareness"""
        # Track conversation context
        self.conversation_history.append({
            'timestamp': datetime.now(),
            'message': message,
            'intent': intent_name
        })
        
        # Keep only last 10 messages
        if len(self.conversation_history) > 10:
            self.conversation_history.pop(0)
            
        # Check for repeated messages or confusion
        similar_messages = sum(1 for hist in self.conversation_history[-3:] 
                              if fuzz.ratio(hist['message'], message) > 80)
        
        if similar_messages >= 2:
            return "I notice you're asking similar questions. Perhaps I can help better if you provide more specific details?"
            
        # Return context-aware response
        return None
        
    def generate_reply(self, message, user_id="default"):
        """Main method to generate bot response"""
        # Preprocess message
        processed_message = self.preprocess_message(message)
        
        # Check for greeting patterns
        greeting_patterns = ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening']
        if any(greeting in processed_message for greeting in greeting_patterns):
            time_greeting = self.get_time_based_greeting()
            return f"{time_greeting}! How can I assist you today?"
            
        # Check for gratitude
        thanks_patterns = ['thanks', 'thank you', 'appreciate', 'grateful']
        if any(thanks in processed_message for thanks in thanks_patterns):
            return random.choice(["You're welcome! 😊", "Happy to help!", "Glad I could assist!"])
            
        # Check for goodbye
        goodbye_patterns = ['bye', 'goodbye', 'see you', 'exit', 'quit']
        if any(goodbye in processed_message for goodbye in goodbye_patterns):
            return random.choice(["Goodbye! Have a great day!", "See you later! 👋", "Take care!"])
            
        # Analyze sentiment
        sentiment = self.get_sentiment(processed_message)
        
        # Find best matching pattern
        best_match, score = self.find_best_match(processed_message)
        
        # Generate base response
        if best_match and score >= 65:
            responses = self.pattern_to_response.get(best_match, [])
            intent_name = self.pattern_to_intent.get(best_match, "unknown")
            
            # Check for context
            context_response = self.get_contextual_response(intent_name, processed_message, user_id)
            if context_response:
                return context_response
                
            if responses:
                reply = random.choice(responses)
                
                # Add sentiment-based modifiers
                if sentiment == "positive" and "sorry" not in reply.lower():
                    reply += " 😊"
                elif sentiment == "negative":
                    reply = "I understand your concern. " + reply
                    
                return reply
                
        # Fallback responses with more variety
        fallback_responses = [
            f"I'm not entirely sure about that. Could you rephrase?",
            f"Interesting question. Let me think... Could you provide more context?",
            f"Hmm, that's a good point. Would you mind explaining differently?"
        ]
        
        return random.choice(fallback_responses)
        
    def get_conversation_stats(self):
        """Get statistics about the current conversation"""
        if not self.conversation_history:
            return "No conversation history available."
            
        unique_intents = set(h['intent'] for h in self.conversation_history if h['intent'] != 'unknown')
        avg_length = sum(len(h['message'].split()) for h in self.conversation_history) / len(self.conversation_history)
        
        return {
            'total_messages': len(self.conversation_history),
            'unique_intents': len(unique_intents),
            'avg_message_length': round(avg_length, 2)
        }

# -----------------------------
# Main Execution
# -----------------------------
if __name__ == "__main__":
    # Get user message
    if len(sys.argv) < 2:
        print("Please enter a message.")
        sys.exit()
        
    user_message = sys.argv[1]
    
    # Initialize chatbot
    chatbot = EnhancedChatbot()
    
    # Generate response
    response = chatbot.generate_reply(user_message)
    
    # Print response
    print(response)
    
    # Optional: Print conversation stats if requested
    if "--stats" in sys.argv:
        stats = chatbot.get_conversation_stats()
        print("\n[Conversation Stats]")
        for key, value in stats.items():
            print(f"{key}: {value}")