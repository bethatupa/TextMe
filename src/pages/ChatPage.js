import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ChatBubble from "../components/ChatBubble";
import axios from "axios";
import "../css/ChatPage.css";

const ChatPage = () => {
  const { contactName } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [selectedMeal, setSelectedMeal] = useState(null);
  const messagesEndRef = useRef(null); // Refs untuk scroll ke bawah

  // Fungsi untuk mengambil pesan yang tersimpan dari localStorage
  const loadMessages = () => {
    const storedMessages = localStorage.getItem(contactName); // Menyimpan berdasarkan nama contactName
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages)); // Memuat pesan yang ada
    }
  };

  // Fungsi untuk menyimpan pesan ke localStorage
  const saveMessages = (messages) => {
    localStorage.setItem(contactName, JSON.stringify(messages)); // Menyimpan pesan berdasarkan contactName
  };

  const sendMessage = async () => {
    if (input.trim()) {
      const userMessage = { message: input, isSender: true };
      const updatedMessages = [...messages, userMessage];
      setMessages(updatedMessages);
      saveMessages(updatedMessages); // Simpan pesan terbaru ke localStorage
      setInput("");

      try {
        const response = await axios.get(
          `https://www.themealdb.com/api/json/v1/1/search.php?s=${input}`
        );

        if (response.data.meals) {
          const mealMessage = {
            message: "Berikut adalah beberapa resep yang bisa kamu coba. Pilih nama resep yang ingin kamu buat untuk melihat bahan dan cara membuatnya.",
            isSender: false,
            choices: response.data.meals
          };
          const newMessages = [...updatedMessages, mealMessage];
          setMessages(newMessages);
          saveMessages(newMessages); // Simpan pesan terbaru ke localStorage
          setSelectedMeal(response.data.meals);
        } else {
          const noRecipeMessage = {
            message: "Maaf, saya tidak menemukan resep dengan nama tersebut. Coba nama masakan lain!",
            isSender: false,
          };
          const newMessages = [...updatedMessages, noRecipeMessage];
          setMessages(newMessages);
          saveMessages(newMessages); // Simpan pesan terbaru ke localStorage
        }
      } catch (error) {
        console.error("Error fetching recipes", error);
        const errorMessage = {
          message: "Terjadi kesalahan saat mencari resep. Coba lagi nanti.",
          isSender: false,
        };
        const newMessages = [...updatedMessages, errorMessage];
        setMessages(newMessages);
        saveMessages(newMessages); // Simpan pesan terbaru ke localStorage
      }
    }
  };

  const showRecipe = (mealIndex) => {
    const meal = selectedMeal[mealIndex];
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
      if (meal[`strIngredient${i}`] && meal[`strMeasure${i}`]) {
        ingredients.push(`${meal[`strIngredient${i}`]} (${meal[`strMeasure${i}`]})`);
      }
    }

    const steps = meal.strInstructions.split("\r\n").map((step, index) => `${index + 1}. ${step}`).join("<br />");

    const recipeMessage = {
      message: `
        <b>${meal.strMeal}</b><br />
        <p><b>Ingridients:</b></p>
        <p>${ingredients.map((ingredient, index) => `${index + 1}. ${ingredient}`).join("<br />")}</p>
        <b>Steps:</b>
        <p>${steps}</p>
      `,
      isSender: false,
    };

    const updatedMessages = [...messages, recipeMessage];
    setMessages(updatedMessages);
    saveMessages(updatedMessages); // Simpan pesan terbaru ke localStorage
  };

  // Effect untuk memuat pesan dari localStorage ketika pertama kali dimuat
  useEffect(() => {
    loadMessages();
  }, []); // Hanya sekali saat pertama kali aplikasi dimuat

  // Effect untuk scroll otomatis ke bawah saat pesan baru muncul
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]); // Akan berjalan setiap kali messages berubah

  return (
    <div className="chat-page">
      <button className="back-button" onClick={() => navigate("/")}>
        Kembali
      </button>
      <h2>{contactName}</h2>
      <div className="chat-container">
        {messages.map((msg, index) => (
          <ChatBubble key={index} message={msg.message} isSender={msg.isSender} />
        ))}
        {messages[messages.length - 1]?.choices && (
          <div className="recipe-choices">
            {messages[messages.length - 1].choices.map((meal, index) => (
              <button key={index} onClick={() => showRecipe(index)} className="recipe-choice-button">
                {`${index + 1}. ${meal.strMeal}`}
              </button>
            ))}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="message-input">
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Tulis nama masakan..." />
        <button className="send-message" onClick={sendMessage}>Kirim</button>
      </div>
    </div>
  );
};

export default ChatPage;