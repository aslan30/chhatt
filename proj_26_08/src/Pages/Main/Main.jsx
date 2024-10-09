import axios from "axios";
import { useEffect, useState } from "react";

function Main() {
    const [items, setItems] = useState()
    useEffect(()=>{
        axios.get('https://reqres.in/api/users').then( res => {
            console.log(res.data.data)
            setItems(res.data.data)
        }).catch( err => {
            console.log(err.message)
        });

    }, []);

    

    return (
        <div className="items flex">
            {!items ? 'loading' : items.map((item, ind) => {
                return (
                    <div className="border-2 border-red-500" key={ind}>
                        <p className="font-bolt">{item.firs_name}</p>
                        <p>{item.last_name}</p>
                        <p>{item.email}</p>
                    </div>
                )
            })}
        </div>
    )
}

export default Main;