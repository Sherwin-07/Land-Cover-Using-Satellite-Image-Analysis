import json
import os
from typing import Dict, List, Optional

class MetadataManager:
    def __init__(self):
        self.metadata: List[Dict[str, str]] = []
        self.load_metadata()
    
    def load_metadata(self) -> None:
        """Load metadata from the meta.json file."""
        try:
            meta_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__)))), 
                                   'data', 'meta.json')
            with open(meta_path, 'r') as f:
                self.metadata = json.load(f)
        except Exception as e:
            print(f"Error loading metadata: {e}")
            self.metadata = []
    
    def get_location(self, image_path: str) -> Optional[str]:
        """Get location for a given image path."""
        image_name = os.path.basename(image_path)
        for entry in self.metadata:
            if entry["image_path"] == image_name:
                return entry["location"]
        return None