import styles from "../styles/Home.module.css";
import LoadCS from "../scripts/LoadCS";
import { useState, useEffect } from "react";
import Jarvis from "../components/Jarvis";
export default function Home() {
  let [data, setData] = useState({ status: "", stream: {}, Jarvis: {} });

  useEffect(async () => {
    const googleTTS = require("google-tts-api");

    let buffer = null;
    const googleTTS_params = {
      lang: "en-GB",
      slow: false,
      host: "https://translate.google.com",
    };
    const Bot = new Discord.Client();

    const prompts = { cached: {}, requested: null };
    const sayings = {
      confused: "I do not know that command.",
    };

    const say = async (text) => {
      return await fetch(googleTTS.getAudioUrl(text, googleTTS_params)).then(
        (response) => {
          return response.body;
        }
      );
    };

    const init = async (stream) => {
      buffer = stream;
      for (let phrase in sayings) {
        prompts.cached[`${phrase}`] = say(sayings[phrase]);
      }
      Bot.login("ODU4OTUyNjEyMTQ1NTI4ODgy.YNln9Q.6oQb-VPR_7GpILU2kQW9chyUF_Y");
    };

    Bot.once("ready", () => {
      console.log("Ready!");
      data.status = "Connected";
      setData(data);
    });

    Bot.on("message", async (message) => {
      await command(message);
    });

    async function command(msg) {
      const prompt = msg.content.substring(2);
      const user = msg.member;
      let voice_channel = null;
      switch (prompt) {
        case "summon":
          data.status = "summoned by " + user.displayName;
          setData(data);
          voice_channel = await summonTo(msg);
          break;

        default:
          break;
      }

      async function summonTo({ member, channel }) {
        if (
          member.voice.channelID &&
          Bot.channelID !== member.voice.channelID
        ) {
          let channel = await Bot.channels.cache
            .get(member.voice.channelID)
            .join();
          channel.play(await say("Hello, " + member.displayName));
          return await channel.receiver.createStream(member, {
            mode: "opus",
            end: "manual",
          });
        }
        await channel.send(
          "Discord Dee Jay: Please join a voice channel first!"
        );
      }
    }

    window.addEventListener("fetch", (event) => {
      const response = caches
        .match(event.request)
        .then((match) => match || fetch(event.request));
      event.respondWith(response);
      console.log("oop");
    });

    data.Jarvis.listen = async (stream) => {
      console.log("clicked");
      data.status = "Inititializing";
      setData(data);
      return await init(stream);
    };
  });

  return (
    <div className={styles.container}>
      <script type="text/javascript" src="discord.min.stable.js"></script>
      <Jarvis data={data} />
    </div>
  );
}
