import { Link } from "react-router-dom";

const Hero = () => {
    return (
        <>
            <div className="card md:card-side bg-base-100 shadow-xl w-full md:w-11/12 p-3 md:p-0">
                <figure className="w-full md:w-1/3">
                    <img
                        src="https://cdn.pixabay.com/photo/2024/04/08/18/23/ai-generated-8684145_1280.jpg"
                        alt="Albert Einstein"
                        className="h-auto w-full md:h-48 object-cover"
                    />
                </figure>
                <div className="card-body w-full md:w-2/3">
                    <h2 className="card-title text-center md:text-left">Let's connect to the world of Physics!</h2>
                    <p className="text-center md:text-left">
                        "Imagination is more important than knowledge. For knowledge is limited, whereas imagination embraces the entire world, stimulating progress, giving birth to evolution." ~ Albert Einstein
                    </p>
                    <div className="card-actions justify-center md:justify-end">
                        <Link to="/signup"><button className="btn btn-primary">Login / Register</button></Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Hero;
