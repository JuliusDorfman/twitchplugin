
// TODO: NOT CURRENTLY IN USE

// @desc Get Test Route
// @route GET /test
// @access public
const getTestRoute = (req, res) => {
    console.log('Test Route Status Code: ', res.statusCode);

    if(!req.body.text) {
        res.status(400).json({Message: 'Status 400'})
    }



    res.status(200).json({ Message: 'Get Test Route'})
}



// @desc Get Top Games from Twitch
// @route GET /getTopGames 
// @access private
const getTopGames = (req, res) => {
    console.log('Get Top Games: ', res.statusCode);
    res.status(200).json({ Message: 'Get Top Games'})
    // getGames(process.env.getGames, accessToken, (response) =>{

    // })
}



const controller = { getTestRoute, getTopGames }

module.exports = { controller };