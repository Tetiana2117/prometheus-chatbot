// import React, { useState } from "react";
// import { Route, Routes, Navigate } from "react-router-dom";
// import ChatBot from "./ChatBot";
// import BookList from "./BookList"; 
// import SpecificBook from "./SpecificBook"; 

// const ParentComponent = () => {
//   const [isChatOpen, setIsChatOpen] = useState(false);
//   const [chatMessages, setChatMessages] = useState([]);

//   const handleChatClose = (updatedMessages) => {
//     setIsChatOpen(false);
//     setChatMessages(updatedMessages);
//   };

//   return (
//     <div>
//       <Routes>
//         <Route
//           path="/"
//           element={
//             <BookList
//               isChatOpen={isChatOpen}
//               onChatOpen={() => setIsChatOpen(true)}
//             />
//           }
//         />
//         <Route
//           path="/chat"
//           element={<ChatBot isOpen={isChatOpen} onClose={handleChatClose} />}
//         />
//         <Route
//           path="/specific-book/:id"
//           element={<SpecificBook onChatOpen={() => setIsChatOpen(true)} />}
//         />
//                <Route path="/*" element={<Navigate to="/" />} />
//       </Routes>
//     </div>
//   );
// };

// export default ParentComponent;
