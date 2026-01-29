import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const CallToAction = () => {
    const navigate = useNavigate();

    return (
        <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="bg-gray-900 rounded-3xl overflow-hidden shadow-2xl relative">
                    {/* Decorative gradients */}
                    <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-blue-600 opacity-20 blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-purple-600 opacity-20 blur-3xl"></div>

                    <div className="relative px-6 py-16 sm:px-12 sm:py-20 lg:px-16 text-center lg:text-left flex flex-col lg:flex-row items-center justify-between gap-10">
                        <div className="max-w-2xl">
                            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                                Ready to get started?
                            </h2>
                            <p className="mt-4 text-lg text-gray-300">
                                Whether you need a job done or want to earn money using your skills, Jinnar is the place for you. Join our growing community today.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                            <button
                                onClick={() => navigate("/landing-services")}
                                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-gray-900 bg-white hover:bg-gray-100 transition-colors shadow-lg"
                            >
                                Find a Worker
                            </button>
                            <button
                                onClick={() => navigate("/signup")}
                                className="inline-flex items-center justify-center px-6 py-3 border border-gray-600 text-base font-medium rounded-xl text-white hover:bg-gray-800 transition-colors bg-gray-800/50 backdrop-blur"
                            >
                                Become a Seller <ArrowRight size={18} className="ml-2" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CallToAction;
