#Overview

An AI-driven grievance management system designed for Indian public services. It enables citizens to submit complaints through a user-friendly portal while authorities manage and resolve them efficiently.
The system uses NLP-based AI models to automatically classify, analyze sentiment, and prioritize grievances, ensuring faster redressal and transparency.


#Frontend

    • React
    • TailwindCSS
#Backend

    • Express.js
    • Node.js
    • Flask
    • MongoDB
#ML

    • NLTK
    • Tensorflow
    • Numpy
      


#Features
Key Features
1. Citizen Portal

Grievance submission with unique tracking ID

AI-based priority assignment (High / Medium / Low)

Status tracking & official announcements

Responsive UI

2. Officials Portal

Department-wise grievance dashboard

Status control (Pending, Processing, Resolved, Rejected)

Analytics & grievance statistics

Admin announcement system

3. AI Capabilities

NLP-based text classification

Sentiment & priority prediction

Flask-based ML microservice

Modular and scalable AI architecture

#How to run

1. Backend (Node.js + MongoDB)

       cd backend
       npm install
       node server.js
2. Frontend(React)

       cd frontend
i)Citizen portal
        
    cd citizen-portal
    npm install
    npm run dev
ii) Admin Portal
    
    cd admin-portal
    cd login-signup
    npm install
    npm run dev
4. Flask server for AI chatbot and classfication

       cd backend
       cd neural-network-chatbot
       python chatbot.py


//for classifier
          
          python classifier.py



#Acknowledgements
>NLTK for natural language preprocessing

>TensorFlow for training AI models

>React & Tailwind for modern UI

>MongoDB for fast and scalable storage