import Intro from "./intro";
import Facts from "./facts";
import Address from "./location";
import Registry from "./registry";
import RSVP from "./rsvp";
import TriviaTitle from "./Trivia";

function App() {
  return (
    <div className="parent-app-container">
      <Intro />
      <TriviaTitle />
      <Facts />
      <Address />
      <Registry />
      <RSVP />
    </div>
  );
}

export default App;
