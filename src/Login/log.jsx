import React from "react"


const log=()=>{
    const [state,setState]=useState('Sign Up');
    return(
        <div>
            <h1>log</h1>
            <div>
                <h2>{state==='Sign Up'?'Create Account':'Login'}</h2>
                <form action="">
                <div className="">
                    {state==='Sign Up'?<input type="text" placeholder="Name" />:<div></div>}
                    <input type="email" placeholder="Email" />
                    <input type="password" placeholder="Password" />
                </div></form>
            </div>
        </div>
    )
}

export default log