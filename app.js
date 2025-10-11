// Simple text generation model
let model;
const wordIndex = {};
const indexToWord = {};

async function loadModel() {
  // Create a simple LSTM model for text generation
  model = tf.sequential();
  model.add(tf.layers.embedding({
    inputDim: Object.keys(wordIndex).length + 1,
    outputDim: 50,
    inputLength: 10
  }));
  model.add(tf.layers.lstm({units: 100, returnSequences: true}));
  model.add(tf.layers.dense({units: Object.keys(wordIndex).length + 1, activation: 'softmax'}));

  model.compile({
    optimizer: 'adam',
    loss: 'categoricalCrossentropy'
  });
}

function preprocessText(text) {
  const words = text.toLowerCase().split(/\s+/);

  // Build word index
  words.forEach((word, index) => {
    if (!wordIndex[word]) {
      wordIndex[word] = Object.keys(wordIndex).length + 1;
      indexToWord[wordIndex[word]] = word;
    }
  });

  return words;
}

function sendMessage() {
  const input = document.getElementById('user-input');
  const chatMessages = document.getElementById('chat-messages');
  const userMessage = input.value;

  // Add user message
  const userMessageEl = document.createElement('div');
  userMessageEl.classList.add('message', 'user-message');
  userMessageEl.textContent = userMessage;
  chatMessages.appendChild(userMessageEl);

  // Preprocess and generate AI response
  const processedText = preprocessText(userMessage);
  const aiResponse = generateResponse(processedText);

  // Add AI message
  const aiMessageEl = document.createElement('div');
  aiMessageEl.classList.add('message', 'ai-message');
  aiMessageEl.textContent = aiResponse;
  chatMessages.appendChild(aiMessageEl);

  input.value = '';
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function generateResponse(inputWords) {
  const responses = [
    "That's interesting! Tell me more.",
    "I understand. What else would you like to discuss?",
    "Fascinating perspective!",
    "I'm always eager to learn more.",
    "Could you elaborate on that?"
  ];

  return responses[Math.floor(Math.random() * responses.length)];
}

function generateImage() {
  const prompt = document.getElementById('image-prompt').value;
  const imageContainer = document.getElementById('generated-image-container');

  // Create a simple ASCII art image generator
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = 200;
  canvas.height = 200;

  // Simple random color generation based on prompt
  const hash = prompt.split('').reduce((acc, char) => char.charCodeAt(0) + ((acc << 5) - acc), 0);
  const r = (hash & 0xFF0000) >> 16;
  const g = (hash & 0x00FF00) >> 8;
  const b = hash & 0x0000FF;

  ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Add some text
  ctx.fillStyle = 'white';
  ctx.font = '20px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('AI Generated', canvas.width/2, canvas.height/2);

  // Clear previous image
  imageContainer.innerHTML = '';
  imageContainer.appendChild(canvas);
}

// Initialize model on page load
window.onload = loadModel;
