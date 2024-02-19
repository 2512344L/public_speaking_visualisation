import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Reload = () => {
    const navigate = useNavigate();
    const [countdown, setCountdown] = useState(10);

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => {
                setCountdown(countdown - 1);
            }, 1000);
            return () => clearTimeout(timer);
        } else {
            navigate('/');
        }
    }, [countdown, navigate]);

    return (
        <div>
            <h1>Please re-upload the video</h1>
            <p>Will jump to homepage after {countdown} seconds.</p>
            <p>If you are not redirected, <a href="/" onClick={() => setCountdown(0)}>click here</a> to return to the homepage.</p>
        </div>
    );
};

export default Reload;
