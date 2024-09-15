interface med{
  name: string,
  time: Date
}

const list:med[] = [{
  name: "paracetamol",
  time: new Date()
},{
  name: "potato",
  time: new Date()
}];

// const list:med[] = await fetch("https://localhost:3000/medicines/today");

function ListItem({name, time}:{name:string, time: Date}){
  return(
    <>
    <li>
    <input type="checkbox" name="medCheckbox" id="medCheckbox" />
    <span>{name}</span>
    <span>{time.toLocaleTimeString().slice(0,5)} {time.toLocaleTimeString().slice(9,11)}</span>
    </li>
    </>
  )
}

function MedTracker() {
  return (
    <>
    <section className='h-screen flex flex-col'>
        <div className="flex justify-center">
        <h1 className="text-4xl">Medicine Tracker</h1>
        </div>
        <div className="flex justify-between px-[10%]">
        <h2 className="text-2xl">Today's medicines: </h2>
        <a href="#">Manage your medicines</a>
        </div>
        <div className="px-[12%]">
        <ul>
        {list.map((medi,ind)=><ListItem key={ind} name={medi.name} time={medi.time}/>)}
        </ul>
        </div>
    </section>
    </>
  )
}

export default MedTracker