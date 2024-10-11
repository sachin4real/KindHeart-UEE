import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../configs/FirebaseConfig'; // Ensure the correct import for Firebase config

const QuizPage = () => {
  const [questions, setQuestions] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const questionCollection = collection(db, 'questions'); // Replace with your collection name
      const questionSnapshot = await getDocs(questionCollection);
      const questionList = questionSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setQuestions(questionList);
    } catch (error) {
      console.error('Error fetching questions: ', error);
    }
  };

  const handleAnswerClick = (questionId, answer) => {
    setSelectedAnswer({ questionId, answer });
  };

  const renderAnswer = (questionId, answer) => {
    const isSelected = selectedAnswer?.questionId === questionId;
    const isCorrect = selectedAnswer?.answer.isAnswer;

    return (
      <TouchableOpacity
        key={answer.answer}
        style={[
          styles.answerButton,
          isSelected && {
            backgroundColor: answer.isAnswer ? '#4CAF50' : '#F44336', // Green if correct, red if wrong
          },
        ]}
        onPress={() => handleAnswerClick(questionId, answer)}
        disabled={isSelected} // Disable the button after selection
      >
        <Text style={styles.answerText}>{answer.answer}</Text>
      </TouchableOpacity>
    );
  };

  const renderQuestion = ({ item }) => (
    <View style={styles.questionContainer}>
      <Text style={styles.questionText}>{item.questionText}</Text>
      {item.answers.map((answer) => renderAnswer(item.id, answer))}
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={questions}
        renderItem={renderQuestion}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.quizContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  quizContainer: {
    paddingBottom: 20,
  },
  questionContainer: {
    marginBottom: 20,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  questionText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  answerButton: {
    padding: 15,
    backgroundColor: '#2196F3',
    marginVertical: 5,
    borderRadius: 8,
  },
  answerText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default QuizPage;
