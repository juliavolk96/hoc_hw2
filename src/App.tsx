import React, { useState } from 'react';
import './App.css';

const New = (props: { children: React.ReactNode }) => (
    <div className='wrap-item wrap-item-new'>
        <span className='label'>New!</span>
        {props.children}
    </div>
);

const Popular = (props: {children: React.ReactNode}) => (
    <div className='wrap-item wrap-item-popular'>
        <span className='label'>Popular!</span>
        {props.children}
    </div>
);

interface VideoProps {
    type: 'video';
    url: string;
    views: number;
}

interface ArticleProps {
    type: 'article';
    title: string;
    views: number;
}

type ListItem = VideoProps | ArticleProps;

interface ListProps {
    list: ListItem[];
}

const Video = (props: VideoProps) => (
    <div className='item item-video'>
        <iframe src={props.url} frameBorder="0" allow='autoplay: encrypted-media' allowFullScreen></iframe>
        <p className='views'>Просмотров: {props.views}</p>
    </div>
);

const Article = (props: ArticleProps) => (
    <div className='item item-article'>
        <h3><a href="#">{props.title}</a></h3>
        <p className='views'>{props.views}</p>
    </div>
);

// HOC
const withWrapper = <P extends VideoProps | ArticleProps>(
    WrappedComponent: React.ComponentType<P>,
    threshold: number
) => {
    return (props: P) => {
        const { views } = props;

        if (views >= threshold) {
            return (
                <Popular>
                    <WrappedComponent {...props} />
                </Popular>
            );
        } else {
            return (
                <New>
                    <WrappedComponent {...props} />
                </New>
            );
        }
    };
};

const VideoWithWrapper = withWrapper<VideoProps>(Video, 1000);
const ArticleWithWrapper = withWrapper<ArticleProps>(Article, 1000);

const ListWithWrappedComponents: React.FC<ListProps> = (props) => (
    <React.Fragment>
        {props.list.map((item, index) => {
            switch (item.type) {
                case 'video':
                    return (
                        <VideoWithWrapper key={item.url} {...item as VideoProps} />
                    );
                case 'article':
                    return (
                        <ArticleWithWrapper key={item.title} {...item as ArticleProps} />
                    );
                default:
                    return null;
            }
        })}
    </React.Fragment>
);

const App: React.FC = () => {
    const [list, setList] = useState<ListItem[]>([
        {
            type: 'video',
            url: 'https://www.youtube.com/embed/dVkK36KOcqs?rel=0&amp;controls=0&amp;showinfo=0',
            views: 12
          },
          {
            type: 'article',
            title: 'Невероятные события в неизвестном поселке...',
            views: 175
          },
          {
            type: 'article',
            title: 'Секретные данные были раскрыты!',
            views: 1532
          },
          {
            type: 'video',
            url: 'https://www.youtube.com/embed/TKmGU77INaM?rel=0&amp;controls=0&amp;showinfo=0',
            views: 4253
          },
          {
            type: 'article',
            title: 'Кот Бегемот обладает невероятной...',
            views: 12,
          },
    ]);

    return (
        <ListWithWrappedComponents list={list}/>
    );
};

export default App;