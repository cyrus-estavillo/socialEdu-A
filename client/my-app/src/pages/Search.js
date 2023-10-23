import React from "react";
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';


const Search= () => {
    return <div className = "input-wrapper">
        <div>
            {<SearchRoundedIcon sx={{ color: "black" }} />}
            <input type="text" placeholder="Search" />
        </div>
    </div>
}


export default Search;
