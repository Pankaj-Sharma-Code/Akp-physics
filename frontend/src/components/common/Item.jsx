const Item = ({ imageSrc, title }) => {

    return (
        <>
            <div className="card bg-base-100 w-36 md:w-96 shadow-xl mb-10">
                <figure className="px-10 pt-10">
                    <img
                        src={imageSrc}
                        alt={title}
                        className="rounded-xl h-15 sm:h-20" />
                </figure>
                <div className="card-body items-center text-center">
                    <h2 className="card-title text-base md:text-lg">{title}</h2>
                </div>
            </div>
        </>
    );
};

export default Item;