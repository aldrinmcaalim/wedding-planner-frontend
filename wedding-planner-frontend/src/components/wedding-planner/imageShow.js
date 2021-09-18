export default function ImageShow(imgSrc) {
    const img = imgSrc.props;
    console.log(img);

    return (
        <>
            <img src={img}></img>
        </>
    );
}
