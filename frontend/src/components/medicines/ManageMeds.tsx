
interface med{
  name: string
}

const list: med[] = [{
  name: "paracetamol"
},
{
  name: "calpol"
}];

function ListItem({name}:{name:string}){
  return(
    <>
    <li>{name}</li>
    </>
  )
}

function ManageMeds() {
  return (
    <>
    <section className='h-screen flex flex-col'>
        <div className="flex justify-center">
        <h1 className="text-4xl">Medicine Tracker</h1>
        </div>
        <div className="flex justify-between px-[10%]">
        <h2 className="text-2xl">Manage your medicines: </h2>
        <a href="#">Today's medicines</a>
        </div>
        <div className="px-[12%]">
        <ul>
        {list.map((medi,ind)=><ListItem key={ind} name={medi.name}/>)}
        </ul>
        </div>
    </section>
    </>
  )
}

export default ManageMeds