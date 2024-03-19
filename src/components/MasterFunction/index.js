import React from 'react';
import Chip from '@mui/material/Chip';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

// const userList = [
//     { id: 1, name: 'name 1' },
//     { id: 2, name: 'name 2' },
//     { id: 3, name: 'name 3' },
//     { id: 4, name: 'name 4' },
//     { id: 5, name: 'name 5' },
// ];

export function AutocompleteControlled({ options, value, setValue }) {
    // const [value, setValue] = React.useState(null);
    // const [value, setValue] = React.useState([userList[0].name]);
    // const [inputValue, setInputValue] = React.useState('');
    console.log('value', value);
    console.log(options);
    return (
        <Autocomplete
            value={value}
            onChange={(event, newValue) => {
                setValue(newValue);
            }}
            fullWidth
            // multiple
            options={options.map((option) => option.account_code)}
            getOptionLabel={(option) => `${option.account_code_display} - ${option.account_name}`}
            freeSolo
            // inputValue={inputValue}
            // onInputChange={(event, newInputValue) => {
            //   setInputValue(newInputValue);
            // }}
            // renderTags={(value, getTagProps) =>
            //     value.map((option, index) => <Chip variant="outlined" label={option} {...getTagProps({ index })} />)
            // }
            renderInput={(params) => <TextField {...params} variant="outlined" placeholder="Search" />}
        />
    );
}
