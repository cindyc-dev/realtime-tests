import Pusher from "pusher-js";
import { SyntheticEvent, useEffect, useRef, useState } from "react";
import PusherStats from "./PusherStats";

export default function PusherComp() {
  const [messages, setMessages] = useState<string[]>([]);
  const [pusher, setPusher] = useState<Pusher | null>(null);
  const [showPusherLogs, setShowPusherLogs] = useState<boolean>(true);

  // Inputs
  const [room, setRoom] = useState<string>("");

  const scrollableDivRef = useRef<HTMLDivElement | null>(null);
  const scrollToBottom = () => {
    if (scrollableDivRef.current) {
      scrollableDivRef.current.scrollTop =
        scrollableDivRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, showPusherLogs]);

  const joinChannel = (e: SyntheticEvent) => {
    e.preventDefault();
    setRoom("");

    if (!pusher) {
      alert(
        "Can't join room without initialising pusher. Try refreshing the page. If that doesn't work, there might be something wrong with our Pusher instance 😞"
      );
      return;
    }

    // Subscribe to a channel
    const channel = pusher.subscribe(room);

    // Bind to an event
    channel.bind("message", (data: string) => {
      console.log({ data });
      const time = new Date().toLocaleTimeString();
      setMessages((prevMessages) => [
        ...prevMessages,
        `[${time}][${room}] ${data}`,
      ]);
    });
  };

  useEffect(() => {
    // Initialize Pusher
    const pusher = new Pusher("8369d7590e9c24fce651", {
      cluster: "ap4",
    });
    Pusher.logToConsole = true;
    Pusher.log = (msg: string) => {
      const time = new Date().toLocaleTimeString();
      setMessages((prev) => [...prev, `[${time}] ${msg}`]);
    };
    setPusher(pusher);

    // Cleanup
    return () => {
      // Unsubscribe and disconnect from Pusher when component unmounts
      pusher.unbind_all();
      pusher.disconnect();
    };
  }, []);

  return (
    <div>
      <PusherStats />
      <details>
        <summary>Technical Explanation</summary>
        <ul>
          <li>
            <a href="https://www.npmjs.com/package/pusher-js" target="_blank">
              npm | pusher-js
            </a>
          </li>
          <li>
            <a
              href="https://pusher.com/docs/channels/library_auth_reference/rest-api/"
              target="_blank"
            >
              Pusher | Rest API
            </a>
          </li>
        </ul>
      </details>
      <h2>Pusher Demo</h2>
      <p>Features Implemented</p>
      <ol>
        <li>Join Channel(s)</li>
        <li>Leave Channel(s)</li>
        <li>Sending Messages to Channel</li>
        <li></li>
      </ol>
      <div>
        Pusher State: {pusher?.connection.state}
        {pusher?.connection.state === "connected"
          ? `🟢`
          : pusher?.connection.state === "connecting"
          ? `...`
          : "🔴"}
        <br />
        Joined Channels:{" "}
        {JSON.stringify(pusher?.allChannels().map((channel) => channel.name))}
      </div>
      <form onSubmit={(e) => joinChannel(e)}>
        <input
          type="text"
          placeholder="Type channel name..."
          value={room}
          onChange={(e) => setRoom(e.currentTarget.value)}
        />
        <button type="submit" disabled={!room.length}>
          {pusher
            ?.allChannels()
            .map((chnl) => chnl.name)
            .includes(room)
            ? "Quit Channel"
            : room.length
            ? "Join Channel"
            : "Join/Quit Channel"}
        </button>
      </form>
      <input
        type="checkbox"
        id="show-pusher-logs"
        checked={showPusherLogs}
        onChange={() => setShowPusherLogs(!showPusherLogs)}
      />
      <label htmlFor="show-pusher-logs">Show Pusher Logs</label>
      <div
        style={{ maxHeight: "200px", overflowY: "scroll", margin: "10px" }}
        ref={scrollableDivRef}
      >
        {messages.length &&
        !(
          !showPusherLogs &&
          !messages.filter((msg) => !msg.includes("Pusher")).length
        )
          ? messages.map((message, i) => {
              if (!showPusherLogs && message.includes("Pusher")) return null;
              return (
                <div
                  key={i}
                  style={{
                    color: message.includes("Pusher") ? "grey" : "black",
                    padding: "3px 0",
                  }}
                >
                  {message}
                </div>
              );
            })
          : "No messages received yet."}
      </div>
      <form onSubmit={() => {}}>
        <input type="text" placeholder="Type a message" />
        <button type="submit">Send Message</button>
      </form>
    </div>
  );
}
