type BannerProps = { title: string };


export default function Banner({ title }: BannerProps) {
return (
    <header>
        <h1>{title}</h1>
    </header>
);
}