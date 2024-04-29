import "./App.css";
import PusherComp from "./components/PusherComp";

function App() {
  return (
    <>
      <h1>Realtime Tests</h1>

      <hr />

      <PusherComp />

      <hr />

      <h2>WebRTC</h2>
      <input type="text" placeholder="Type a message" />
      <button>Send</button>
    </>
  );
}

export default App;
