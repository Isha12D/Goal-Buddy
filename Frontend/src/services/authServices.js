// export async function refreshAccessToken() {
//     const refreshToken = localStorage.getItem('refreshToken');
    
//     if (!refreshToken) {
//         console.error('No refresh token found in localStorage');
//         return; // Exit if no refresh token
//     }

//     try {
//         const response = await fetch('http://localhost:3001/token', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ token: refreshToken }),
//         });

//         if (response.ok) {
//             const data = await response.json();
//             localStorage.setItem('accessToken', data.accessToken);
//             console.log('Access token refreshed successfully');
//         } else {
//             console.error('Failed to refresh access token:', response.statusText);
//         }
//     } catch (error) {
//         console.error('Error refreshing access token:', error);
//     }
// }


export async function refreshAccessToken() {
    const refreshToken = localStorage.getItem('refreshToken');
    console.log("Retrieved refreshToken:", refreshToken);  // Log the token value for debugging

    if (!refreshToken) {
        console.error('No refresh token found in localStorage');
        return; // Exit if no refresh token
    }

    try {
        const response = await fetch('http://localhost:3006/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: refreshToken }),
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('accessToken', data.accessToken);
            console.log('Access token refreshed successfully');
        } else {
            console.error('Failed to refresh access token:', response.statusText);
        }
    } catch (error) {
        console.error('Error refreshing access token:', error);
    }
}
