export default function Address() {
  return (
    <div className="address-container">
      <h2>Where We Plan To Party?</h2>

      <div className="address-details">

        <div className="time">
          <p className="left">Date:</p>
          <p className="right">November 1st 2025</p>
        </div>
        
        <div className="time">
          <p className="left">Time:</p>
          <p className="right">6pm-11pm</p>
        </div>

        <div className="address">
          <p className="left">Where:</p>
          <ul className="right">
            <li>Learie Constantine Centre </li>
            <li>Villiers Road (nearest tube station - Dollis Hill)</li>
            <li> NW2 2FD</li>
          </ul>
        </div>

        <div className="parking">
          <p className="left">Parking:</p>
          <p className="right">An abundance of free parking bays are available on the main road and surrounding 
            roads all day
          </p>
        </div>

        <div className="dress-code">
          <p className="left">Dress Code:</p>
          <p className="right">Glam yourselves up in your best party attire and come looking Instagram ready!
          </p>
        </div>

        <div className="details">
            <p className="left">Details:</p>
          <p className="right">
            Please arrive on time so you don't miss out on the good parts
            of the evening. This is an adult only event so we politely ask that  
            only those directly invited attend. We can of course accommodate adult 
            family members who are accompanying elderly guests.
          </p>
        </div>
     
      </div>
    </div>
  );
}
