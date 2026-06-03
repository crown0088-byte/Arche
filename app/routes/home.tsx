import type { Route } from "./+types/home";
import { useNavigate } from "react-router";
import Navbar from "../../components/Navbar";
import Upload from "../../components/Upload";
import { ArrowRight, Clock, Layers } from "lucide-react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Arche - Build Beautiful Spaces" },
    { name: "description", content: "Transform 2D floor plans into photorealistic 3D renders." },
  ];
}

export default function Home() {
  const navigate = useNavigate();

  // Handles the transition from upload completion to the interactive visualizer
  const handleUploadComplete = (base64Image: string) => {
    const uniqueId = Date.now().toString();

    // Redirects to your dynamic visualizer route, passing the image data state
    navigate(`/visualizer/${uniqueId}`, {
      state: {
        initialImage: base64Image,
        name: `Residence ${uniqueId.slice(-4)}`,
      },
    });
  };

  return (
      <div className="home">
        <Navbar />

        {/* Hero Presentation Block */}
        <section className="hero">
          <div className="announce">
            <div className="dot" />
            <div className="pulse" />
            <p>Introducing Arche 2.0</p>
          </div>

          <h1>Build beautiful spaces at the speed of thought with Arche</h1>

          <p className="subtitle">
            Arche is an AI-first design environment that helps you visualize,
            render, and ship architectural projects faster than ever.
          </p>

          <div className="actions">
            <a href="#upload" className="cta">
              Start Building <ArrowRight className="icon" />
            </a>
            <button className="btn btn-variant-outline btn-size-lg demo">
              Watch Demo
            </button>
          </div>

          {/* Interactive Dropzone Module */}
          <div id="upload" className="upload-shell">
            <div className="grid-overlay" />

            <div className="upload-card">
              <div className="upload-head">
                <div className="upload-icon">
                  <Layers className="icon" />
                </div>
                <h3>Upload your floor-plan</h3>
                <p>Supports JPG, PNG formats up to 10MB</p>
              </div>

              <Upload onComplete={handleUploadComplete} />
            </div>
          </div>
        </section>

        {/* Historical Community Showroom Grid */}
        <section className="projects">
          <div className="section-inner">
            <div className="section-head">
              <div className="copy">
                <h2>Projects</h2>
                <p>Your latest work and shared community projects, all in one place.</p>
              </div>
            </div>

            <div className="projects-grid">
              <div className="project-card group">
                <div className="preview">
                  <img
                      src="https://roomify-mlhuk267-dfwu1i.puter.site/projects/1770803585402/rendered.png"
                      alt="Arche AI Rendered Space"
                  />
                  <div className="badge">
                    <span>community</span>
                  </div>
                </div>
                <div className="card-body">
                  <div>
                    <h3>Project Mumbai</h3>
                    <div className="meta">
                      <Clock size={12} />
                      <span>{new Date("01.01.2026").toLocaleDateString()}</span>
                      <span> By M.N.Shah</span>
                    </div>
                  </div>
                  <div className="arrow">
                    <ArrowRight size={18} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
  );
}