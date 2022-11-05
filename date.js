

exports.getDate = function(){
    const date = new Date();
    const options = {
        'weekday': 'long',
        'day': 'numeric',
        'month': 'long'
    }
    let day = date.toLocaleString('en-US', options)
    return day;
}

exports.getDay = function(){
    const date = new Date();
    const options = {
        'weekday': 'long'
    }
    let day = date.toLocaleDateString('en-US', options);
    return day;
}