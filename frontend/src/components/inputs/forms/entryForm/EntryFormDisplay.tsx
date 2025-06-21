import React from "react";
import { Stack } from "react-bootstrap";
import EntryFormDisplayProps from "../../../../constants/inputs/forms/entryForm/entryFormDisplayProps.ts";


const EntryFormDisplay: React.FC<EntryFormDisplayProps> = ({ parameters }) => {
    return (
        <>
            {parameters.length === 0 && <p>No item found</p>}
            <Stack gap={1}>
                {parameters.map((parameter) => (
                    <div key={parameter.name} className="p-2">
                        {parameter.name}
                    </div>
                ))}
            </Stack>
        </>
    );
};

export default EntryFormDisplay;
