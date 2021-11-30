exports.getTickets = (req, res, next) =>{
    res.status(200).json([{
        id: 'e1',
        title: "ticket name dummy number 1"
    }])
}