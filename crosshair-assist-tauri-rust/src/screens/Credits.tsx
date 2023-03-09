const Credits = () => {
    const getYear = new Date ().getFullYear ();
    return (
        <div style={{
            display: 'flex',
            flexDirection: "column",
            alignItems: "center",
            margin: '20px'
        }}>
            <p className="landing_title">Copyright (C) 2016-{getYear} Societyg Software</p>
            <p className="display_body">by AroliSG all right reserved - AIM ASSIST</p>
        </div>
    );
}


export default Credits;