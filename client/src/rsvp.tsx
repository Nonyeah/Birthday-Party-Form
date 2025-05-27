import { useState, useRef } from "react";

interface AttendanceObject {
  name: string;
  email: string;
  otherguests: string | number;
  attending: boolean;
}

function RSVP() {
  const [fullname, setfullname] = useState<string>("Enter your full name");
  const [email, setemail] = useState<string>("Enter your email address");
  const [otherguests, setotherguests] = useState<string | number>("");
  const [accept, setaccept] = useState<boolean>(false);
  const [reject, setreject] = useState<boolean>(false);
  const messageRef = useRef<HTMLDivElement | null>(null);
  const warning = useRef<HTMLParagraphElement | null>(null);
  const [isvisible, setisvisible] = useState<boolean>(false);

  function send(e: React.FormEvent<HTMLFormElement>) {
    const defaultText = "Enter your full name";
    e.preventDefault();
    if ((!accept && !reject) || !fullname || fullname === defaultText) {
      warning.current!.innerHTML =
        "Please complete all form fields and don't forget \
      to click the accept or reject button";
      return false;
    }

    const pattern = /[<\>]/;
    const refuse = fullname.match(pattern);
    if (refuse) {
      warning.current!.innerHTML =
        "Only alpha numeric characters allowed. Please \
       enter your name correctly";
      return false;
    }

    if (fullname.length > 55) {
      warning.current!.innerHTML =
        "Your name is too long. Please only enter your first \
     and surname";
      return false;
    }

    const attendanceObject: AttendanceObject = {
      name: fullname,
      email: email,
      otherguests: otherguests,
      attending: accept ? true : false,
    };

    fetch("http://localhost:3000", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(attendanceObject),
    })
      .then((response: Response) => response.text())
      .then((data: string) => {
        setisvisible(true);
        return data;
      })
      .then((data: string) => {
        messageRef.current!.firstElementChild!.innerHTML = data;
      })
      .then(() =>
        setTimeout(() => {
          setfullname("");
          setemail("");
          setotherguests("");
          setaccept(false);
          setreject(false);
          //messageRef.current!.classList.remove("show");
          messageRef.current!.firstElementChild!.innerHTML = "";
          setisvisible(false);
        }, 10000)
      )
      .catch((err) => {
        warning.current!.textContent = `Hmmm, seems like there's 
        a tech problem: ${err}. Please try again later`;
      });
  }

  function handleNameFocus(): void {
    setfullname("");
  }

  function handleEmailFocus(): void {
    setemail("");
  }

  function handleAccept(): void {
    setaccept(true);
    setreject(false);
  }

  function handleReject(): void {
    setreject(true);
    setaccept(false);
  }

  return (
    <>
      <div ref={messageRef} className={isvisible ? "show" : "hide"}>
        <p></p>
      </div>
      <form className={isvisible ? "hideForm" : "showForm"} onSubmit={send}>
        <div className="form-container">
          <h2>RSVP</h2>
          <p ref={warning}></p>
          <div className="form-name">
            <label>
              Your Name:
              <br />
              <input
                id="fname"
                type="text"
                name="fname"
                value={fullname}
                onChange={(e) => setfullname(e.target.value)}
                onFocus={handleNameFocus}
                required
              />
            </label>
          </div>

          <div className="form-email">
            <label>
              Email Address:
              <br />
              <input
                id="email"
                type="email"
                name="email"
                value={email}
                onChange={(e) => setemail(e.target.value)}
                onFocus={handleEmailFocus}
                required
              />
            </label>
          </div>

          <div className="response-buttons">
            <button
              onClick={handleAccept}
              className={accept ? "accept" : ""}
              name="accept"
              type="button"
            >
              Joyfully Accepts
            </button>
            <button
              onClick={handleReject}
              className={reject ? "reject" : ""}
              type="button"
              name="reject"
            >
              Regretfully Declines
            </button>
          </div>

          <div className="form-others">
            <label>
              Add Additional Guests:
              <br />
              <input
                id="other"
                name="other"
                type="text"
                inputMode="numeric"
                pattern="[0-9]{0,1}"
                value={otherguests}
                onChange={(e) => {
                  const guestNumber = e.target.value;
                  if (/^\d{0,1}$/.test(guestNumber)) {
                    setotherguests(e.target.value);
                  }
                }}
              />
            </label>
          </div>
          <button id="submit" type="submit">
            Submit
          </button>
        </div>
      </form>
    </>
  );
}

export default RSVP;
