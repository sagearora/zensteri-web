import React from "react";
import BackButton from "../../lib/BackButton";
import ChangeLabel from "./ChangeLabel";
import ReprintLabel from "./ReprintLabel";

function ToolsScreen() {

    return <div className='my-6 container'>
        <BackButton
            href="/"
        />
        <ReprintLabel />
        <ChangeLabel />
    </div>
}

export default ToolsScreen;
