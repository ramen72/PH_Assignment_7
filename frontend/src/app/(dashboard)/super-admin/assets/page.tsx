import AssetList from "@/components/assets/AssetList";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const AssetPage = () => {
    return (
        <div>
            <div className="pr-5 flex justify-end">
                <Button nativeButton={false} render={<Link href={"/super-admin/assets/create"}>New Asset</Link>}></Button>
            </div>
            <div>
                <AssetList/>
            </div>
        </div>
    );
};

export default AssetPage;