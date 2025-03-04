import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main>
        {/* Hero Section */}
        <section className="bg-green-800 text-white px-6 py-24 sm:py-32">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
                Network Observability Platform
              </h1>
              <p className="mt-6 text-xl max-w-2xl mx-auto">
                Monitor, query, and analyze your network traffic with ease.
                Deploy within your VPC for complete control and security.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Link
                  href="/dashboard"
                  className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-green-800 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  Get started
                </Link>
                <Link
                  href="/query"
                  className="text-sm font-semibold leading-6 flex items-center"
                >
                  Try the query interface{" "}
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                Built on Object Storage, Deployed in Your Cloud
              </h2>
              <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                Our platform leverages your existing object storage for
                cost-effective, scalable network observability.
              </p>
            </div>

            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Your Cloud, Your Control
                </h3>
                <p className="text-gray-600">
                  Deploy entirely within your VPC for complete data sovereignty.
                  Your network data never leaves your infrastructure.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  10x Lower Cost
                </h3>
                <p className="text-gray-600">
                  Leverage cost-effective object storage instead of expensive
                  proprietary systems. Eliminate inter-AZ data transfer fees.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Powerful Query Interface
                </h3>
                <p className="text-gray-600">
                  Our intuitive query builder makes it easy to analyze network
                  data without specialized query languages.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-white border-t border-gray-200 py-12 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-600">
            &copy; {new Date().getFullYear()} Network Observability Platform.
            All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
