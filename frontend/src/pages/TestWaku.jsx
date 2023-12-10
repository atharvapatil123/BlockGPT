import { useEffect, useState } from 'react';
import { Buffer } from 'buffer';
import { useWaku, useLightPush, useFilterMessages, useStoreMessages, useContentPair } from "@waku/react";
import protobuf from 'protobufjs';


function TestWaku() {

//   const { checkIfWalletConnected, currentAccount } = useAuth()
  window.Buffer = Buffer;
  const { node } = useWaku();
  window.tmp = node;

  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState([]);

  // Update the inputMessage state as the user input changes
  const handleInputChange = (e) => {
    setInputMessage(e.target.value);
  };

  const { encoder, decoder } = useContentPair();
  const { push } = useLightPush({ node, encoder });

  // Create a message structure using Protobuf
  const ChatMessage = new protobuf.Type("ChatMessage")
    .add(new protobuf.Field("timestamp", 1, "uint64"))
    .add(new protobuf.Field("message", 2, "string"));



//   useEffect(() => {
//     checkIfWalletConnected();
//   }, []);

  const sendMessage = async () => {
    if (!push || inputMessage.length === 0) return;

    // Create a new message object
    const timestamp = Date.now();
    const protoMessage = ChatMessage.create({
      timestamp: timestamp,
      message: inputMessage
    });
    console.log("proto", protoMessage, timestamp, inputMessage)


    // Serialise the message and push to the network
    const payload = ChatMessage.encode(protoMessage).finish();
    console.log("payload", payload)

    let counter = 0;
    while (counter < 3) {
      const { recipients, errors } = await push({ payload, timestamp });
      console.log("receipants", recipients)
      if (recipients.length > 0) {
        break;
      } else {
        counter += 1;
      }

    // Check for errors
    if (errors.length === 0) {
      setInputMessage("");
      console.log("MESSAGE PUSHED");
    } else {
      console.log(errors);
    }
    }
  }
  const { messages: filterMessages } = useFilterMessages({ node, decoder });

  const { messages: storeMessages } = useStoreMessages({ node, decoder });
  // Create the store query
  const [storeQuery, setStoreQuery] = useState(undefined);

  // Process the messages
//   const callback = (wakuMessage) => {
//     // Render the message/payload in your application
//     console.log(wakuMessage);
// };



  // const fetchStoredData = async () => {
  //   await node.store.queryWithOrderedCallback(
  //     [decoder],
  //     callback,
  //   );
  //   for await (const messagesPromises of storeQuery) {
  //     // Fulfil the messages promises
  //     const messages = await Promise.all(messagesPromises
  //       .map(async (p) => {
  //         const msg = await p;
  //         // Render the message/payload in your application
  //         console.log("oi2b9bu9bu9b")
  //         console.log(msg);
  //       }))
  //   }
  // }

  // useEffect(() => {
  //   if (storeQuery) {



  //     fetchStoredData()
  //   }
  // })

  // Render the list of messages
  useEffect(() => {
    console.log("node", node)
    if (node !== undefined) {
      // setStoreQuery(
        // node.store.queryGenerator([decoder]))
      // setMessages(filterMessages.map((wakuMessage) => {
      //   if (!wakuMessage.payload) return;
      //   return ChatMessage.decode(wakuMessage.payload);
      // }));
    // }
    const allMessages = storeMessages.concat(filterMessages);
    console.log("allMessages", allMessages)
    setMessages(allMessages.map((wakuMessage) => {
      if (!wakuMessage.payload) return;
      return ChatMessage.decode(wakuMessage.payload);
  }));
}

    // fetchStoredData()
  }, [filterMessages, storeMessages]);
  // Render the list of messages
  useEffect(() => {
    console.log("node", node)
    if (node !== undefined) {
      // setStoreQuery(
        // node.store.queryGenerator([decoder]))
      // setMessages(filterMessages.map((wakuMessage) => {
      //   if (!wakuMessage.payload) return;
      //   return ChatMessage.decode(wakuMessage.payload);
      // }));
    // }
    const allMessages = storeMessages.concat(filterMessages);
    console.log("allMessages", allMessages)
    setMessages(allMessages.map((wakuMessage) => {
      if (!wakuMessage.payload) return;
      return ChatMessage.decode(wakuMessage.payload);
  }));
}

    // fetchStoredData()
  }, [filterMessages, storeMessages]);


  return (
    <div className="App">
      <>
        <div className="chat-interface">
          <h1>Waku React Demo</h1>
          <div className="chat-body">
            {messages.map((message, index) => (
              <div key={index} className="chat-message">
                <span>{new Date(message.timestamp).toUTCString()}</span>
                <div className="message-text">{message.message}</div>
              </div>
            ))}
          </div>
          {/* <button onClick={readWaku}>
                      receive
                </button> */}
          <div className="chat-footer">
            <input
              type="text"
              id="message-input"
              value={inputMessage}
              onChange={handleInputChange}
              placeholder="Type your message..."
            />
            <button className="send-button" onClick={sendMessage} disabled={node === undefined}>Send</button>
          </div>
        </div>

      </>
    </div>
  );
}

export default TestWaku;
