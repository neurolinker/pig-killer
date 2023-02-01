import { useState } from "react";
import { ResponseTypes } from "../types/response-types";

const Index = () => {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [findResult, setFindResult] = useState<ResponseTypes>(new ResponseTypes());

  function handleSubmit(e) {
    setLoading(true)
    e.preventDefault();
    const postData = async () => {
      const data = {
        search: search,
      };

      const response = await fetch("/api/search", {
        method: "POST",
        body: JSON.stringify(data),
      });
      return response.json();
    };
    
    postData().then((data) => {
      const result = data.message
      const serving = result.split('|')[0].split('-')[0].replace(/(\r\n|\n|\r|\t)/gm,"")
      const cal = result.split('|')[0].split('-')[1].split(':')[1]
      const fat = result.split('|')[1].split(':')[1]
      const carb = result.split('|')[2].split(':')[1]
      const protein = result.split('|')[3].split(':')[1].split('g')[0]+'g'
      setFindResult({serving, cal,fat,carb,protein})
      setLoading(false)
    });
  }

  return (
    <div className = "bg-gray-600 h-screen flex flex-col items-center justify-center">
      <div className = " flex items-center justify-center w-36">
          <img className = "object-cover" src = "./images/babi-anjing.png"/>
      </div>
      <form className = " w-full md:w-1/2 flex p-3" onSubmit={handleSubmit}>
          {/* <label htmlFor="Searching">Searching</label> */}
          <label className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
          <div className="relative w-full">
              <></>
              {/* <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg aria-hidden="true" className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              </div> */}
              <input 
                type="search" 
                id="search"
                className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                placeholder="Temukan Kalori makanan / minuman" 
                value={search}
              onChange={(e) => setSearch(e.target.value)}
              />
              <button 
                type="submit" 
                className="text-white absolute right-2.5 bottom-2.5 bg-gray-700  focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 "
              >
                <svg aria-hidden="true" className="w-5 h-5 text-gray-500 hover:text-pink-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              </button>
          </div>
      </form>
      <div className = "w-full md:w-1/2 flex items-center justify-center p-3">
          {loading ? (
            <div className = "text-pink-300">Babi sedang mencari ...</div>
            
          ):(
            findResult.serving !== '' && (
              <div className = "bg-gradient-to-r from-pink-100 to-pink-400 w-full rounded-md p-3 shadow-2xl">
                <div className = "mb-3">
                  {findResult.serving}
                </div>
                <div className = "">
                  Kalori : {findResult.cal}
                </div>
                <div className = "">
                  Karbohidrat : {findResult.carb}
                </div>
                <div className = "">
                  Lemak : {findResult.fat}
                </div>
                <div className = "">
                  Protein : {findResult.protein}
                </div>
              </div>
            )
            
          )}
      </div>
    </div>
  );
};

export default Index;