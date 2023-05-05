const apiKey = "94653b74802b0c7786ce17ce90bd892f";

const chatbox = document.querySelector(".chatbox");
const conversation = chatbox.querySelector(".conversation");
const input = chatbox.querySelector("input");
const button = chatbox.querySelector("button");
const botName="ChatBot";
const speech=false;

//Create Message
function createMessage(text, sender) {
  const message = document.createElement("div");
  message.style.padding="3px";
  if(sender=="bot")
  {
    message.classList.add("message");
    message.classList.add(sender);
    message.textContent =text;
    message.style.fontStyle="italic";
    conversation.appendChild(message);
    Speech(text);
  }
  else
  {
    message.classList.add("message");
    message.classList.add(sender);
    message.textContent =text;
    conversation.appendChild(message);
  }
  conversation.scrollTop = conversation.scrollHeight;
}

//Send Message
function sendMessage() {
    const inp=input.value;
    var greetings = ['hey','heya','hey there','yo','hi','howdy','hello'];

    //Greetings Response
    if(greetings.includes(inp.toLowerCase())){
        createMessage(inp, "user");
        const hi = ['Hi','Howdy','Hello']
        botMessage = hi[Math.floor(Math.random()*(hi.length))];
        botMessage="ChatBot: "+botMessage;
        createMessage(botMessage,"bot");
        input.value="";
    }

    //Clear Response
    else if(inp=="Clear"||inp=="clear"){
        createMessage(inp, "user");
        conversation.replaceChildren();
        input.value="";
    }

    //Help Response
    else if(inp=="Help"||inp=="help"){
        createMessage(inp, "user");
        help();
        input.value="";
    }

    //Artist Response
    else if(inp.charAt(inp.length-1)=='$'){
      console.log("Artist Search");
      console.log(inp.substring(0,inp.length-1));
      const artist = input.value.substring(0,input.value.length-1);
        if (artist.trim() === "") {
            return;
        }
        input.value = "";
        createMessage(artist, "user");
        fetch(`https://ws.audioscrobbler.com/2.0/?method=artist.gettoptracks&artist=${artist}&api_key=${apiKey}&format=json`)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
            createMessage(`Sorry, I couldn't find any songs for ${artist}.`, "bot");
            help();
            } else {
            const tracks = data.toptracks.track.slice(0, 5); 
            createMessage(`${botName}: Here are some top songs by ${artist}:`, "bot");
            tracks.forEach(track => {
                createMessage(`${track.name} by ${track.artist.name}`, "bot");
            });
            }
        })
        .catch(() => {
            console.error("An error occurred while fetching data from the Last.fm API.");
        });
    }

    //Genre Response
    else if(inp.charAt(inp.length-1)=='!'){
      console.log("Genre Search");
      const genre = input.value.substring(0,input.value.length-1);
        if (genre.trim() === "") {
            return;
        }
        input.value = "";
        createMessage(genre, "user");
        fetch(`https://ws.audioscrobbler.com/2.0/?method=tag.gettoptracks&tag=${genre}&api_key=${apiKey}&format=json`)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
            createMessage(`Sorry, I couldn't find any songs for ${genre}.`, "bot");
            help();
            } else {
            const tracks = data.tracks.track.slice(0, 5); 
            createMessage(`${botName}: Here are some top songs for ${genre}:`, "bot");
            tracks.forEach(track => {
                createMessage(`${track.name} by ${track.artist.name}`, "bot");
            });
            }
        })
        .catch(() => {
            console.error("An error occurred while fetching data from the Last.fm API.");
        });
    }

    //Song Response
    else if(inp.charAt(inp.length-1)=='#'){
      console.log("Song Search");
      const line = input.value.substring(0,input.value.length-1);
      var arr=line.split(" by ");
      const track=arr[0];
      const artist=arr[1];
        if (track.trim() === "") {
            return;
        }
        input.value = "";
        createMessage(line, "user");
        fetch(`https://ws.audioscrobbler.com/2.0/?method=track.getsimilar&artist=${artist}&track=${track}&api_key=${apiKey}&format=json`)
        .then(response => response.json())
        .then(data => {
          console.log(data);
            if (data.error) {
            createMessage(`Sorry, I couldn't find any songs for ${artist}.`, "bot");
            help();
            } else {
            const tracks = data.similartracks.track.slice(0, 5); 
            createMessage(`${botName}: Here are some similar songs:`, "bot");
            tracks.forEach(track => {
                createMessage(`${track.name} by ${track.artist.name}`, "bot");
            });
            }
        })
        .catch(() => {
            console.error("An error occurred while fetching data from the Last.fm API.");
        });
    }

    //Standard Response
    else{
        const genre = input.value;
        if (genre.trim() === "") {
            return;
        }
        input.value = "";
        createMessage(genre, "user");
        fetch(`https://ws.audioscrobbler.com/2.0/?method=tag.gettoptracks&tag=${genre}&api_key=${apiKey}&format=json`)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
            createMessage(`Sorry, I couldn't find any songs for ${genre}.`, "bot");
            help();
            } else {
            const tracks = data.tracks.track.slice(0, 5); 
            createMessage(`${botName}: Here are some top songs for ${genre}:`, "bot");
            tracks.forEach(track => {
                createMessage(`${track.name} by ${track.artist.name}`, "bot");
            });
            }
        })
        .catch(() => {
            console.error("An error occurred while fetching data from the Last.fm API.");
        });
    }
}

document.onkeypress = keyPress;
function keyPress(e) {
  var x = e || window.event;
  var key = (x.keyCode || x.which);
  if (key == 13 || key == 3) {
    sendMessage();
  }
}

//Help Function
function help()
{
    createMessage(`ChatBot: Help Section: `, "bot");
    createMessage(`genre/artist_name/song_name - Get top songs of genre/artist/similar to song`, "bot");
    createMessage(`Search for precise result:`, "bot");
    createMessage(`genre_name! - Get top songs of genre`, "bot");
    createMessage(`song_name by artist# - Get top similar songs`, "bot");
    createMessage(`artist_name$ - Get top songs of artist`, "bot");
}

//Speech Function
function Speech(say) {
  if ('speechSynthesis' in window && speech) {
    var utterance = new SpeechSynthesisUtterance(say);
    //msg.voice = voices[10]; 
    //msg.voiceURI = 'native';
    //utterance.volume = 1; // 0 to 1
    utterance.rate = 2.5;
    //utterance.pitch = 1; //0 to 2
    //utterance.text = 'Hello World';
    //utterance.lang = 'en-US';
    speechSynthesis.speak(utterance);
  }
}