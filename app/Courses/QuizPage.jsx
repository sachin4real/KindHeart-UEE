import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../configs/FirebaseConfig';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const QuizPage = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);

  const navigation = useNavigation();

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const questionCollection = collection(db, 'questions');
      const questionSnapshot = await getDocs(questionCollection);
      const questionList = questionSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      if (questionList.length === 0) {
        Alert.alert('Success!', 'No questions found.');
      }

      setQuestions(questionList);
    } catch (error) {
      console.error('Error fetching questions: ', error);
    }
  };

  const handleAnswerClick = (questionId, answer) => {
    setSelectedAnswer({ questionId, answer });
    if (answer.isAnswer) {
      setCorrectAnswersCount(prevCount => prevCount + 1);
      //Alert.alert('Correct!', 'You selected the right answer.');
    } 
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
    } else {
      Alert.alert(
        'Quiz Completed!',
        `You have successfully completed the quiz. Correct answers: ${correctAnswersCount} / ${questions.length}.`,
        [
          {
            text: 'Go to back',
            onPress: () => navigation.navigate('Education/EducationPage'), // Change 'Home' to your desired route
          },
          {
            text: 'Retry Quiz',
            onPress: () => {
              setCurrentQuestionIndex(0);
              setCorrectAnswersCount(0);
              setSelectedAnswer(null);
            },
          },
        ]
      );
    }
  };

  const handleBackPress = () => {
    Alert.alert(
      'Confirmation',
      'Do you want to go back?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () => navigation.goBack(),
        },
      ],
      { cancelable: true }
    );
  };

  if (questions.length === 0) {
    return (
      <View style={styles.container}>
        <Text>Loading questions...</Text>
      </View>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const completionPercentage = ((currentQuestionIndex + 1) / questions.length) * 100; // Calculate completion percentage

  return (
    <View style={styles.container}>
      {/* Custom Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>

      {/* Completion Bar */}
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, { width: `${completionPercentage}%` }]} />
      </View>

      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>{currentQuestion.questionText}</Text>
        {currentQuestion.answers.map((answer) => (
          <TouchableOpacity
            key={answer.answer}
            style={[
              styles.answerButton,
              selectedAnswer?.questionId === currentQuestion.id && {
                backgroundColor: answer.isAnswer ? '#4CAF50' : '#F44336',
              },
            ]}
            onPress={() => handleAnswerClick(currentQuestion.id, answer)}
            disabled={selectedAnswer?.questionId === currentQuestion.id}
          >
            <Text style={styles.answerText}>{answer.answer}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          onPress={handleNextQuestion}
          style={styles.nextButton}
          disabled={selectedAnswer === null} // Enable only if an answer is selected
        >
          <Text style={styles.nextButtonText}>
            {currentQuestionIndex < questions.length - 1 ? 'Next' : 'Finish'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.resultContainer}>
        <Text style={styles.resultText}>
          Correct Answers: {correctAnswersCount} / {questions.length}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'space-between', // Distribute elements evenly
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 50,
  },
  progressBarContainer: {
    marginTop: 150, // Adjusted margin to create space between back button and progress bar
    height: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    marginBottom: 20,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 5,
  },
  questionContainer: {
    marginTop: 20,
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
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  answerButton: {
    padding: 15,
    backgroundColor: '#2196F3',
    marginVertical: 10,
    borderRadius: 8,
    elevation: 2,
  },
  answerText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end', // Align button to the right
    paddingBottom: 30, // Padding at the bottom to position correctly
  },
  nextButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 30, // Rounded button
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resultContainer: {
    marginTop: 10,
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    alignItems: 'center',
  },
  resultText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default QuizPage;
