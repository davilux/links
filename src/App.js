function App() {
  const data = {
    name: "Davi Lux",
    image: "http://github.com/davilux.png",
    bio: "Ethical Hacker",
    links: [
      {
        name: "Tip me",
        url: "http://venmo.com/davilux/",
        icon: "venmo",
      },
      {
        name: "Check out my projects on GitHub",
        url: "https://github.com/davilux/",
        icon: "github",
      },
      {
        name: "Personal portfolio site",
        url: "https://davilux.github.io/",
        icon: "",
      },
      {
        name: "Follow me on Instagram",
        url: "https://instagram.com/mx.davilux",
        icon: "instagram",
      },
    ],
  };
  return (
    <div className="App">
      <img
        alt={`portrait of ${data.name}`}
        src={data.image}
        className="profile-pic"
      ></img>
      <h1>{data.name}</h1>
      <ul>
        {data.links.map((link, idx) => {
          return (
            <li key={`link-${idx}`}>
              <a href={link.url} target="_blank" rel="noreferrer">
                {link.name}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default App;
