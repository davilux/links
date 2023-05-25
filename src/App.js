import GitHubIcon from "@mui/icons-material/GitHub";
import PaidIcon from "@mui/icons-material/Paid";
import ComputerIcon from "@mui/icons-material/Computer";
import InstagramIcon from "@mui/icons-material/Instagram";

import Sparkles from "./sparkles/Sparkles";

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
        name: "Check out my projects",
        url: "https://github.com/davilux/",
        icon: "github",
      },
      {
        name: "Personal portfolio site",
        url: "https://davilux.github.io/",
        icon: "computer",
      },
      {
        name: "Follow me on Instagram",
        url: "https://instagram.com/mx.davilux",
        icon: "instagram",
      },
    ],
  };

  const loadIcon = (iconName) => {
    if (iconName === "github") return <GitHubIcon />;
    if (iconName === "venmo") return <PaidIcon />;
    if (iconName === "computer") return <ComputerIcon />;
    if (iconName === "instagram") return <InstagramIcon />;
  };

  return (
    <div className="App">
      <Sparkles>
        <img
          alt={`portrait of ${data.name}`}
          src={data.image}
          className="profile-pic"
        ></img>
      </Sparkles>
      <h1>{data.name}</h1>
      <ul>
        {data.links.map((link, idx) => {
          return (
            <a
              key={`link-${idx}`}
              href={link.url}
              target="_blank"
              rel="noreferrer"
            >
              <button>
                {loadIcon(link.icon)}
                <p>
                  <Sparkles>{link.name}</Sparkles>
                </p>
              </button>
            </a>
          );
        })}
      </ul>
    </div>
  );
}

export default App;
