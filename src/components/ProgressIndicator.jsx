import PropTypes from "prop-types";
import { Card, CardContent } from "@/components/ui/card";

export function ProgressIndicator({ progress, status }) {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <div>
                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-primary-foreground bg-primary">
                  {status}
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold inline-block">
                  {progress}%
                </span>
              </div>
            </div>
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-secondary">
              <div
                style={{ width: `${progress}%` }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary transition-all duration-500"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

ProgressIndicator.propTypes = {
  progress: PropTypes.number.isRequired,
  status: PropTypes.string.isRequired,
};

export default ProgressIndicator;
